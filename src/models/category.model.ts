import clientPromise from "@/lib/db";

export interface Category {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CategoryCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Category>("categories");
}