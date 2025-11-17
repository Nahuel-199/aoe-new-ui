import clientPromise from "@/lib/db";

export interface Subcategory {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const SubcategoryCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Subcategory>("subcategories");
};
