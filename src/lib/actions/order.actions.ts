"use server";

import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/order.model";
import mongoose from "mongoose";
import { getCurrentUserId } from "./auth-wrapper";
import { CartItem } from "@/types/cart.types";
import { redirect } from "next/navigation";
import "@/models/product.model";
import { revalidatePath } from "next/cache";

export async function createOrder({ items }: { items: CartItem[] }) {
  await connectDB();

  const userId = await getCurrentUserId();

  if (!userId) throw new Error("Usuario no autenticado");

  const total = items.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);

  const orderItems = items.map((i) => ({
    product: i.productId,
    variant: {
      ...i.variant,
      quantity: i.quantity,
    },
  }));

  const order = await OrderModel.create({
    user: userId,
    items: orderItems,
    total,
    status: "pending",
  });

  return JSON.parse(JSON.stringify(order));
}

export async function createManualOrder(data: {
  items: {
    name: string;
    description?: string;
    images: string[];
    color?: string;
    size?: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  remainingAmount: number;
  status?: string;
  paymentStatus?: string;
  shippingAddress?: string;
  deliveryMethod?: string;
  deliveryCost?: number;
  paymentMethod?: string;
  paidAmount?: number;
  phoneNumber?: string;
  meetingAddress?: string;
  notes?: string;
}) {
  await connectDB();

  const {
    items,
    total,
    remainingAmount,
    status = "pendiente",
    paymentStatus = "pendiente",
    shippingAddress = "",
    deliveryMethod = "",
    deliveryCost = 0,
    paymentMethod = "",
    paidAmount = 0,
    phoneNumber = "",
    meetingAddress = "",
    notes = "",
  } = data;

  const userId = process.env.MANUAL_USER_ID;
  if (!userId) throw new Error("MANUAL_USER_ID no definido en .env");

  const newOrder = new OrderModel({
    user: userId,
    items: items.map((i) => ({
      product: null, // No está asociada a un producto existente
      variant: {
        name: i.name,
        description: i.description,
        images: i.images,
        color: i.color,
        size: i.size,
        price: i.price,
      },
      quantity: i.quantity,
    })),
    total,
    remainingAmount,
    status,
    paymentStatus,
    shippingAddress,
    deliveryMethod,
    deliveryCost,
    paymentMethod,
    paidAmount,
    phoneNumber,
    meetingAddress,
    notes,
    createdAt: new Date(),
  });

  await newOrder.save();

  revalidatePath("/admin/orders");

  return JSON.parse(JSON.stringify(newOrder));
}

export async function getAllOrders() {
  await connectDB();
  const orders = await OrderModel.find()
    .populate("user", "name email")
    .populate("items.product", "name");
  return JSON.parse(JSON.stringify(orders));
}

export async function getOrdersByUser(userId: string) {
  await connectDB();
  const orders = await OrderModel.find({ user: userId }).populate(
    "items.product",
    "name"
  );
  return JSON.parse(JSON.stringify(orders));
}

export async function getOrderById(orderId: string) {
  await connectDB();
  const order = await OrderModel.findById(orderId)
    .populate("user", "name email")
    .populate("items.product", "name");
  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
) {
  await connectDB();
  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
    .populate("user", "name email")
    .populate("items.product", "name");
  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderItems(
  orderId: string,
  items: {
    productId: string;
    variant: {
      type: string;
      color: string;
      size: string;
      price: number;
    };
    quantity: number;
  }[]
) {
  await connectDB();

  const total = items.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);

  const orderItems = items.map((i) => ({
    product: new mongoose.Types.ObjectId(i.productId),
    variant: {
      type: i.variant.type,
      color: i.variant.color,
      size: i.variant.size,
      price: i.variant.price,
      quantity: i.quantity,
    },
  }));

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { items: orderItems, total },
    { new: true }
  );

  return JSON.parse(JSON.stringify(order));
}

export async function updateOrderAdmin(formData: FormData) {
  await connectDB();

  const orderId = formData.get("orderId") as string;
  const deliveryCost = Number(formData.get("deliveryCost") || 0);
  const data = {
    comments: formData.get("comments") as string,
    paymentMethod: formData.get("paymentMethod") as string,
    paidAmount: Number(formData.get("paidAmount") || 0),
    remainingAmount: Number(formData.get("remainingAmount") || 0),
    phoneNumber: formData.get("phoneNumber") as string,
    deliveryMethod: formData.get("deliveryMethod") as
      | "correo"
      | "punto_encuentro",
    deliveryCost,
    meetingAddress: formData.get("meetingAddress") as string,
  };

  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { $set: data },
    { new: true }
  );

  redirect("/admin/orders");

  if (!order) throw new Error("Orden no encontrada");

  return JSON.parse(JSON.stringify(order));
}

export async function deleteOrder(orderId: string) {
  await connectDB();
  await OrderModel.findByIdAndDelete(orderId);
  return { success: true };
}
