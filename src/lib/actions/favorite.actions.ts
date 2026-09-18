"use server";

import { ObjectId } from "mongodb";
import { FavoriteCollection } from "@/models/favorite.model";
import { getCurrentUserId } from "./auth-wrapper";
import { getDb } from "@/lib/db";
import { categoryLookupStages } from "./pipelines";
import { deepSerialize } from "@/lib/serialize";
import { Product } from "@/types/product.types";
import { revalidatePath } from "next/cache";

export async function getFavoriteProductIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const favoritesCol = await FavoriteCollection();
  const favorites = await favoritesCol
    .find({ userId: new ObjectId(userId) })
    .toArray();

  return favorites.map((f) => f.productId.toString());
}

export async function toggleFavorite(
  productId: string
): Promise<{ isFavorite: boolean }> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  const favoritesCol = await FavoriteCollection();
  const existing = await favoritesCol.findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
  });

  if (existing) {
    await favoritesCol.deleteOne({ _id: existing._id });
    revalidatePath("/favoritos");
    return { isFavorite: false };
  }

  await favoritesCol.insertOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId),
    createdAt: new Date(),
  });

  revalidatePath("/favoritos");
  return { isFavorite: true };
}

export async function getFavoriteProducts(): Promise<Product[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const favoritesCol = await FavoriteCollection();
  const favorites = await favoritesCol
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  if (favorites.length === 0) return [];

  const db = await getDb();
  const products = await db
    .collection("products")
    .aggregate([
      { $match: { _id: { $in: favorites.map((f) => f.productId) } } },
      ...categoryLookupStages,
    ])
    .toArray();

  // El $match no preserva orden: reordenamos según "favorito más reciente primero".
  const order = favorites.map((f) => f.productId.toString());
  const sorted = [...products].sort(
    (a, b) => order.indexOf(a._id.toString()) - order.indexOf(b._id.toString())
  );

  return deepSerialize<Product[]>(sorted);
}
