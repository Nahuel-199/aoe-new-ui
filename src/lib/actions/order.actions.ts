"use server";

import { connectDB } from "@/lib/db";
import { OrderModel } from "@/models/order.model";
import mongoose from "mongoose";
import { getCurrentUserId } from "./auth-wrapper";
import { CartItem } from "@/types/cart.types";

export async function createOrder({
    items,
}: {
    items: CartItem[];
}) {

    await connectDB();

    const userId = await getCurrentUserId();

    if (!userId) throw new Error("Usuario no autenticado");

    const total = items.reduce(
        (acc, i) => acc + i.variant.price * i.quantity,
        0
    );

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


export async function getAllOrders() {
    await connectDB();
    const orders = await OrderModel.find()
        .populate("user", "name email")
        .populate("items.product", "name");
    return JSON.parse(JSON.stringify(orders));
}


export async function getOrdersByUser(userId: string) {
    await connectDB();
    const orders = await OrderModel.find({ user: userId })
        .populate("items.product", "name");
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
    ).populate("user", "name email")
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

    const total = items.reduce(
        (acc, i) => acc + i.variant.price * i.quantity,
        0
    );

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

export async function updateOrderAdmin(
    orderId: string,
    data: {
        comments?: string;
        paymentMethod?: string;
        paidAmount?: number;
        remainingAmount?: number;
        phoneNumber?: string;
        deliveryMethod?: "correo" | "punto_encuentro";
        meetingAddress?: string;
        status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    }
) {
    await connectDB();

    const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { $set: data },
        { new: true }
    );

    if (!order) {
        throw new Error("Orden no encontrada");
    }

    return JSON.parse(JSON.stringify(order));
}

export async function deleteOrder(orderId: string) {
    await connectDB();
    await OrderModel.findByIdAndDelete(orderId);
    return { success: true };
}