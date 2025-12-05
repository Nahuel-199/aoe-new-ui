"use server";

import { ObjectId } from "mongodb";
import { NotificationCollection } from "@/models/notification.model";
import { getCurrentUserId } from "./auth-wrapper";
import { revalidatePath } from "next/cache";

export async function createNotification(
  userId: string,
  message: string,
  orderId?: string
) {
  const notificationsCol = await NotificationCollection();

  await notificationsCol.insertOne({
    userId: new ObjectId(userId),
    message,
    orderId: orderId ? new ObjectId(orderId) : undefined,
    isRead: false,
    createdAt: new Date(),
  });

  revalidatePath("/", "layout");
}

export async function getUserNotifications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const notificationsCol = await NotificationCollection();

  const notifications = await notificationsCol
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return JSON.parse(JSON.stringify(notifications));
}

export async function markNotificationAsRead(notificationId: string) {
  const notificationsCol = await NotificationCollection();
  const userId = await getCurrentUserId();

  if (!userId) throw new Error("Unauthorized");

  await notificationsCol.updateOne(
    { _id: new ObjectId(notificationId), userId: new ObjectId(userId) },
    { $set: { isRead: true } }
  );

  revalidatePath("/", "layout");

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const notificationsCol = await NotificationCollection();
  const userId = await getCurrentUserId();

  if (!userId) throw new Error("Unauthorized");

  await notificationsCol.updateMany(
    { userId: new ObjectId(userId), isRead: false },
    { $set: { isRead: true } }
  );

  revalidatePath("/", "layout");

  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const notificationsCol = await NotificationCollection();
  const userId = await getCurrentUserId();

  if (!userId) throw new Error("Unauthorized");

  await notificationsCol.deleteOne({
    _id: new ObjectId(notificationId),
    userId: new ObjectId(userId),
  });

  revalidatePath("/", "layout");

  return { success: true };
}
