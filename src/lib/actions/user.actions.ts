"use server";

import { getDb } from "@/lib/db";
import { deepSerialize } from "@/lib/serialize";
import { User } from "@/types/user.types";

export async function findOrCreateUser(userData: {
  name?: string;
  email: string;
  image?: string;
}): Promise<User | null> {
  const db = await getDb();
  const usersCol = db.collection<User>("users");

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

  return deepSerialize<User | null>(result ?? null);
}