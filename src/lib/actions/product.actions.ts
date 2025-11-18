"use server";

import clientPromise from "@/lib/db";
import { Category, Product, Subcategory, Variant } from "@/types/product.types";
import { deleteImage } from "@/utils/deleteCloudinary";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

interface ImageInput {
  id: string;
  url: string;
}

interface VariantInput {
  type: string;
  price: number;
  is_offer: boolean;
  price_offer?: number;
  color: string;
  images: ImageInput[];
  sizes: { size: string; stock: number }[];
  size_chart?: string;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  subcategories?: string[];
  variants: VariantInput[];
}) {
  const client = await clientPromise;
  const db = client.db("test");

  const product = await db.collection("products").insertOne({
    ...data,
    category: new ObjectId(data.category),
    subcategories: data.subcategories?.map((id) => new ObjectId(id)) ?? [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/products");
  revalidatePath("/");

  return { _id: product.insertedId };
}

export async function getProducts() {
  const client = await clientPromise;
  const db = client.db("test");

  const products = await db
    .collection("products")
    .aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategories",
          foreignField: "_id",
          as: "subcategories",
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export async function getOffers() {
  const client = await clientPromise;
  const db = client.db("test");

  const offers = await db
    .collection("products")
    .aggregate([
      { $match: { "variants.is_offer": true } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategories",
          foreignField: "_id",
          as: "subcategories",
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(offers));
}

export async function getProductById(id: string): Promise<Product | null> {
  const client = await clientPromise;
  const db = client.db("test");

  const products = await db
    .collection("products")
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategories",
          foreignField: "_id",
          as: "subcategories",
        },
      },
    ])
    .toArray();

  const raw = products[0];
  if (!raw) return null;

  const product: Product = {
    _id: raw._id.toString(),
    name: raw.name,
    description: raw.description,

    category: {
      _id: raw.category._id.toString(),
      name: raw.category.name,
    } satisfies Category,

    subcategories: raw.subcategories.map((sub: any) => ({
      _id: sub._id.toString(),
      name: sub.name,
    })) satisfies Subcategory[],

    variants: (raw.variants ?? []).map((v: any) => ({
      type: v.type,
      price: v.price,
      is_offer: v.is_offer,
      price_offer: v.price_offer,
      color: v.color,

      images: (v.images ?? []).map((img: any) => ({
        id: img.id,
        url: img.url,
      })),

      sizes: (v.sizes ?? []).map((s: any) => ({
        size: s.size,
        stock: s.stock,
      })),

      size_chart: v.size_chart,
    })) satisfies Variant[],
  };

  return product;
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
  const client = await clientPromise;
  const db = client.db("test");

  const updateData: any = { ...data, updatedAt: new Date() };

  if (data.category) {
    updateData.category = new ObjectId(data.category);
  }

  if (data.subcategories) {
    updateData.subcategories = data.subcategories.map((id) => new ObjectId(id));
  }

  await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  return getProductById(id);
}

export async function deleteProduct(id: string) {
  const client = await clientPromise;
  const db = client.db("test");

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

  revalidatePath("/admin/products");

  return { success: true };
}

export async function deleteProductImage(
  productId: string,
  variantIndex: number,
  imageId: string
) {
  const client = await clientPromise;
  const db = client.db("test");

  await deleteImage(imageId);

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });

  if (!product) throw new Error("Producto no encontrado");

  product.variants[variantIndex].images = product.variants[
    variantIndex
  ].images.filter((img: any) => img.id !== imageId);

  await db
    .collection("products")
    .updateOne(
      { _id: new ObjectId(productId) },
      { $set: { variants: product.variants } }
    );

  return JSON.parse(JSON.stringify(product));
}
