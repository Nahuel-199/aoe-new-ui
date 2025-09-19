"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { OrderModel, OrderItem } from "@/models/order.model";
import { ProductModel } from "@/models/product.model";
import { User } from "@/models/user.model";

interface CartItem {
    productId: string;
    variantColor: string;
    variantSize: string;
    quantity: number;
}

interface CreateOrderData {
    items: CartItem[];
    paymentMethod: "card" | "paypal" | "cash";
}

export async function createOrder(data: CreateOrderData) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Usuario no logeado");

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("Usuario no encontrado");

    const orderItems: OrderItem[] = [];

    for (const item of data.items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

        const variant = product.variants.find(
            (v: { color: string }) => v.color === item.variantColor
        );
        if (!variant) throw new Error(`Variante ${item.variantColor} no encontrada`);

        const sizeObj = variant.sizes.find((s: { size: string; stock: number }) => s.size === item.variantSize);
        if (!sizeObj) throw new Error(`Tamaño ${item.variantSize} no encontrado`);
        if (sizeObj.stock < item.quantity)
            throw new Error(`Stock insuficiente para ${product.name}`);

        orderItems.push({
            product: product._id,
            variant: { color: variant.color, size: item.variantSize },
            quantity: item.quantity,
            price: product.is_offer ? product.price_offer : product.price,
        });

        sizeObj.stock -= item.quantity;
        await product.save();
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await OrderModel.create({
        user: user._id,
        items: orderItems,
        total,
        paymentMethod: data.paymentMethod,
        status: "pending",
    });

    return order;
}

export async function getUserOrders() {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Usuario no logeado");

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("Usuario no encontrado");

    const orders = await OrderModel.find({ user: user._id }).sort({ createdAt: -1 });
    return orders;
}

export async function getAllOrders() {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return orders;
}

export async function updateOrderStatus(orderId: string, status: string) {
    await connectDB();

    const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );

    if (!updatedOrder) throw new Error("Orden no encontrada");
    return updatedOrder;
}

export async function cancelOrder(orderId: string) {
    await connectDB();

    const cancelledOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true }
    );

    if (!cancelledOrder) throw new Error("Orden no encontrada");
    return cancelledOrder;
}