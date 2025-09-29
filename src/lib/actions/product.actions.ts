"use server";

import { connectDB } from "../db";
import { ProductModel } from "@/models/product.model";
import "@/models/category.model";
import "@/models/subcategory.model";
import { deleteImage } from "@/utils/deleteCloudinary";
import mongoose from "mongoose";
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
}

export async function createProduct(data: {
  name: string;
  description?: string;
  category: string;
  subcategories?: string[];
  variants: VariantInput[];
}) {
  await connectDB();

  const product = await ProductModel.create({
    ...data,
    category: new mongoose.Types.ObjectId(data.category),
    subcategories: data.subcategories?.map(
      (id) => new mongoose.Types.ObjectId(id)
    ),
  });

  return JSON.parse(JSON.stringify(product));
}

export async function getProducts() {
  await connectDB();
  const products = await ProductModel.find()
    .populate("category")
    .populate("subcategories")
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getOffers() {
  await connectDB();

  const offers = await ProductModel.find({
    "variants.is_offer": true,
  })
    .populate("category")
    .populate("subcategories")
    .lean();

  return JSON.parse(JSON.stringify(offers));
}

export async function getProductById(id: string) {
  await connectDB();
  const product = await ProductModel.findById(id)
    .populate("category")
    .populate("subcategories")
    .lean();
  return JSON.parse(JSON.stringify(product));
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
  await connectDB();

  const updateData = { ...data } as any;

  if (data.category) {
    updateData.category = new mongoose.Types.ObjectId(data.category);
  }

  if (data.subcategories) {
    updateData.subcategories = data.subcategories.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
  }

  const updated = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("category")
    .populate("subcategories")
    .lean();

  return JSON.parse(JSON.stringify(updated));
}

export async function deleteProduct(id: string) {
  await connectDB();

  const product = await ProductModel.findById(id);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  for (const variant of product.variants) {
    for (const image of variant.images) {
      if (image.id) {
        await deleteImage(image.id);
      }
    }
  }

  await ProductModel.findByIdAndDelete(id);
  revalidatePath("/admin/products");

  return { success: true };
}

export async function deleteProductImage(
  productId: string,
  variantIndex: number,
  imageId: string
) {
  await connectDB();

  await deleteImage(imageId);

  const product = await ProductModel.findById(productId);
  if (!product) throw new Error("Producto no encontrado");

  product.variants[variantIndex].images = product.variants[
    variantIndex
  ].images.filter((img: any) => img.id !== imageId);

  await product.save();

  return JSON.parse(JSON.stringify(product));
}
