"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function createSubcategory(data: { name: string }) {
  const client = await clientPromise;
  const db = client.db("test");

  const res = await db.collection("subcategories").insertOne({
    name: data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const subcategory = await db
    .collection("subcategories")
    .findOne({ _id: res.insertedId });

  return JSON.parse(JSON.stringify(subcategory));
}

export async function getSubcategories() {
  const client = await clientPromise;
  const db = client.db("test");

  const subcategories = await db.collection("subcategories").find().toArray();

  return JSON.parse(JSON.stringify(subcategories));
}

export async function deleteSubcategory(id: string) {
  const client = await clientPromise;
  const db = client.db("test");

  const res = await db
    .collection("subcategories")
    .deleteOne({ _id: new ObjectId(id) });

  return { success: res.deletedCount === 1 };
}

export async function updateSubcategory(id: string, data: { name?: string }) {
  const client = await clientPromise;
  const db = client.db("test");

  const updateData: any = { ...data, updatedAt: new Date() };

  await db.collection("subcategories").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  const updated = await db
    .collection("subcategories")
    .findOne({ _id: new ObjectId(id) });

  return JSON.parse(JSON.stringify(updated));
}