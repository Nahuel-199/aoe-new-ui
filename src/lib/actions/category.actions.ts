"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { deepSerialize } from "@/lib/serialize";

export async function createCategory(data: { name: string }) {
  const client = await clientPromise;
  const db = client.db("test");

  const res = await db.collection("categories").insertOne({
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const category = await db
    .collection("categories")
    .findOne({ _id: res.insertedId });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return deepSerialize(category);
}

export async function getCategories() {
  const client = await clientPromise;
  const db = client.db("test");

  const categories = await db.collection("categories").find().toArray();

  return deepSerialize(categories);
}

export async function deleteCategory(id: string) {
  const client = await clientPromise;
  const db = client.db("test");

  const res = await db
    .collection("categories")
    .deleteOne({ _id: new ObjectId(id) });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return { success: res.deletedCount === 1 };
}

export async function updateCategory(id: string, data: { name?: string }) {
  const client = await clientPromise;
  const db = client.db("test");

  const updateData: any = { ...data, updatedAt: new Date() };

  await db
    .collection("categories")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  const updated = await db
    .collection("categories")
    .findOne({ _id: new ObjectId(id) });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return deepSerialize(updated);
}
