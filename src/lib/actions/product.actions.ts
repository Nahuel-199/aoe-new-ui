"use server";

import { getDb } from "@/lib/db";
import {
  Product,
  ImageInput,
  VariantInput,
  GetProductsParams,
  GetProductsResult,
} from "@/types/product.types";
import { deleteImage } from "@/utils/deleteCloudinary";
import { ObjectId, type Document } from "mongodb";
import { revalidatePath } from "next/cache";
import { deepSerialize } from "@/lib/serialize";
import { categoryLookupStages } from "./pipelines";

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  subcategories?: string[];
  variants: VariantInput[];
}) {
  const db = await getDb();

  const product = await db.collection("products").insertOne({
    ...data,
    category: new ObjectId(data.category),
    subcategories: data.subcategories?.map((id) => new ObjectId(id)) ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/admin");

  return { _id: product.insertedId };
}

/**
 * Sin argumentos devuelve el catálogo completo, en el mismo orden y forma
 * que antes (así lo sigue usando `src/app/admin/layout.tsx`). Con
 * category/subcategory/search/sort/page+pageSize arma un `$match` + `$sort`
 * + `$skip`/`$limit` en el propio pipeline de Mongo, en vez de traer todo y
 * filtrar en el cliente (así lo usa el catálogo público en `/products`).
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<GetProductsResult> {
  const db = await getDb();
  const { page, pageSize, category, subcategory, search, sort, onlyOffers } = params;

  const hasFilters = Boolean(
    category || subcategory || search || sort || page || pageSize || onlyOffers
  );

  if (!hasFilters) {
    const products = await db
      .collection("products")
      .aggregate(categoryLookupStages)
      .toArray();

    const serialized = deepSerialize<Product[]>(products);
    return { products: serialized, total: serialized.length };
  }

  const match: Record<string, unknown> = {};
  if (category) match.category = new ObjectId(category);
  if (subcategory) match.subcategories = new ObjectId(subcategory);
  if (onlyOffers) match["variants.is_offer"] = true;

  const pipeline: Document[] = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });
  pipeline.push(...categoryLookupStages);

  // El regex de `search` corre después del $lookup para poder matchear
  // también por nombre de categoría/subcategoría, no solo por el del producto
  // (ej: buscar "naruto" debe encontrar productos de la subcategoría "Naruto"
  // aunque esa palabra no esté en el nombre del producto).
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "category.name": { $regex: search, $options: "i" } },
          { "subcategories.name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  if (sort === "menor" || sort === "mayor") {
    pipeline.push({ $addFields: { _minPrice: { $min: "$variants.price" } } });
    pipeline.push({ $sort: { _minPrice: sort === "menor" ? 1 : -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  const hasPagination = typeof page === "number" && typeof pageSize === "number";

  if (!hasPagination) {
    const products = await db.collection("products").aggregate(pipeline).toArray();
    const serialized = deepSerialize<Product[]>(products);
    return { products: serialized, total: serialized.length };
  }

  const skip = (page! - 1) * pageSize!;
  const [result] = await db
    .collection("products")
    .aggregate([
      ...pipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize! }],
          count: [{ $count: "total" }],
        },
      },
    ])
    .toArray();

  return {
    products: deepSerialize<Product[]>(result?.data ?? []),
    total: result?.count?.[0]?.total ?? 0,
  };
}

export async function getOffers() {
  const db = await getDb();

  const offers = await db
    .collection("products")
    .aggregate([{ $match: { "variants.is_offer": true } }, ...categoryLookupStages])
    .toArray();

  return deepSerialize<Product[]>(offers);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();

  const products = await db
    .collection("products")
    .aggregate([{ $match: { _id: new ObjectId(id) } }, ...categoryLookupStages])
    .toArray();

  const raw = products[0];
  if (!raw) return null;

  return deepSerialize<Product>(raw);
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    subcategories?: string[];
    variants?: VariantInput[];
  }
) {
  const db = await getDb();

  const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };

  if (data.category) {
    updateData.category = new ObjectId(data.category);
  }

  if (data.subcategories) {
    updateData.subcategories = data.subcategories.map((id) => new ObjectId(id));
  }

  await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return getProductById(id);
}

export async function deleteProduct(id: string) {
  const db = await getDb();

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) throw new Error("Producto no encontrado");

  for (const variant of product.variants) {
    for (const image of variant.images) {
      if (image.id) await deleteImage(image.id);
    }
  }

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });

  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteProductImage(
  productId: string,
  variantIndex: number,
  imageId: string
) {
  const db = await getDb();

  await deleteImage(imageId);

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });

  if (!product) throw new Error("Producto no encontrado");

  product.variants[variantIndex].images = product.variants[
    variantIndex
  ].images.filter((img: ImageInput) => img.id !== imageId);

  await db
    .collection("products")
    .updateOne(
      { _id: new ObjectId(productId) },
      { $set: { variants: product.variants } }
    );

  return deepSerialize(product);
}
