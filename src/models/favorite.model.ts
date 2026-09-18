import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export interface Favorite {
  _id?: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
}

export const FavoriteCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Favorite>("favorites");
};
