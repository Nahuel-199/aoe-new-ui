"use server";

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { deepSerialize } from "@/lib/serialize";

export async function createSubcategory(data: { name: string }) {
  const db = await getDb();

  const res = await db.collection("subcategories").insertOne({
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const subcategory = await db
    .collection("subcategories")
    .findOne({ _id: res.insertedId });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return deepSerialize(subcategory);
}

export async function getSubcategories() {
  const db = await getDb();

  const subcategories = await db.collection("subcategories").find().toArray();

  return deepSerialize(subcategories);
}

export async function deleteSubcategory(id: string) {
  const db = await getDb();

  const res = await db
    .collection("subcategories")
    .deleteOne({ _id: new ObjectId(id) });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return { success: res.deletedCount === 1 };
}

export async function updateSubcategory(id: string, data: { name?: string }) {
  const db = await getDb();

  const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };

  await db.collection("subcategories").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  const updated = await db
    .collection("subcategories")
    .findOne({ _id: new ObjectId(id) });

  revalidatePath("/admin/subcategories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return deepSerialize(updated);
}