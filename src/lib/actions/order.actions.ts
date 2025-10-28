"use server";

import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/order.model";
import mongoose from "mongoose";
import { getCurrentUserId } from "./auth-wrapper";
import { CartItem } from "@/types/cart.types";
import { redirect } from "next/navigation";
import "@/models/product.model";
import { ProductModel } from "@/models/product.model";
import { Variant } from "@/types/product.types";
import { revalidatePath } from "next/cache";

export async function createOrder({ items }: { items: CartItem[] }) {
    await connectDB();

    const userId = await getCurrentUserId();
    if (!userId) throw new Error("Usuario no autenticado");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const total = items.reduce(
            (acc, i) => acc + i.variant.price * i.quantity,
            0
        );

        for (const item of items) {
            const product = await ProductModel.findById(item.productId).session(session);
            if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);

            const variant = product.variants.find((v: Variant) =>
                v.color === item.variant.color && v.type === item.variant.type
            );

            if (!variant) {
                throw new Error(`Variante no encontrada en el producto ${product.name}`);
            }

            const sizeObj = variant.sizes.find((s: Variant['sizes'][number]) => s.size === item.variant.size);
            if (!sizeObj) {
                throw new Error(
                    `Talle ${item.variant.size} no encontrado en ${product.name} (${variant.color})`
                );
            }

            if (sizeObj.stock < item.quantity) {
                throw new Error(
                    `Stock insuficiente para ${product.name} (${variant.color} - ${sizeObj.size})`
                );
            }

            sizeObj.stock -= item.quantity;

            await product.save({ session });
        }

        const orderItems = items.map((i) => ({
            product: i.productId,
            variant: { ...i.variant, quantity: i.quantity },
        }));

        const order = await OrderModel.create(
            [
                {
                    user: userId,
                    items: orderItems,
                    total,
                    status: "pending",
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return JSON.parse(JSON.stringify(order[0]));
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error creando orden:", error);
        throw new Error(`Error creando la orden: ${error}`);
    }
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
        deliveryMethod: formData.get("deliveryMethod") as "correo" | "punto_encuentro",
        deliveryCost,
        meetingAddress: formData.get("meetingAddress") as string,
    };

    const order = await OrderModel.findByIdAndUpdate(orderId, { $set: data }, { new: true });

    redirect("/admin/orders");

    if (!order) throw new Error("Orden no encontrada");

    return JSON.parse(JSON.stringify(order));
}

export async function deleteOrder(orderId: string) {
  await connectDB();
  await OrderModel.findByIdAndDelete(orderId);
  return { success: true };
}
