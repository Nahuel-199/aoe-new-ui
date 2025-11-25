import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export interface Notification {
  _id?: ObjectId;
  userId: ObjectId;
  orderId?: ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export const NotificationCollection = async () => {
  const client = await clientPromise;
  return client.db("test").collection<Notification>("notifications");
};
