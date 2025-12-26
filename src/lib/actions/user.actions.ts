"use server";

import clientPromise from "@/lib/db";
import { deepSerialize } from "@/lib/serialize";

export async function findOrCreateUser(userData: {
  name?: string;
  email: string;
  image?: string;
}) {
  const client = await clientPromise;
  const db = client.db("test");
  const usersCol = db.collection("users");

  const now = new Date();

  const result = await usersCol.findOneAndUpdate(
    { email: userData.email },
    {
      $setOnInsert: {
        name: userData.name || "Sin nombre",
        email: userData.email,
        image: userData.image || null,
        role: "user",
        createdAt: now,
      },
      $set: {
        updatedAt: now,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    }
  );

  const user = result?.value ?? null;

  return deepSerialize(user);
}