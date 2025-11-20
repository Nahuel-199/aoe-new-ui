"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentUserId } from "./auth-wrapper";
import { CartItem } from "@/types/cart.types";
import { redirect } from "next/navigation";
import { Variant } from "@/types/product.types";
import { Order } from "@/types/order.types";

export async function createOrder({ items }: { items: CartItem[] }) {
  const client = await clientPromise;

  const db = client.db("test");

  const productsCol = db.collection("products");
  const ordersCol = db.collection("orders");

  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  const session = client.startSession();

  try {
    let orderData: any = null;

    await session.withTransaction(async () => {
      const total = items.reduce(
        (acc, i) => acc + i.variant.price * i.quantity,
        0
      );

      for (const item of items) {
        const product = await productsCol.findOne(
          { _id: new ObjectId(item.productId) },
          { session }
        );

        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }

        const variant = product.variants.find(
          (v: Variant) =>
            v.color === item.variant.color && v.type === item.variant.type
        );

        if (!variant) {
          throw new Error(
            `Variante no encontrada en el producto ${product.name}`
          );
        }

        const sizeObj = variant.sizes.find(
          (s: Variant["sizes"][number]) => s.size === item.variant.size
        );

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

        await productsCol.updateOne(
          {
            _id: new ObjectId(item.productId),
            "variants.color": item.variant.color,
            "variants.type": item.variant.type,
            "variants.sizes.size": item.variant.size,
          },
          {
            $inc: {
              "variants.$[variant].sizes.$[size].stock": -item.quantity,
            },
          },
          {
            session,
            arrayFilters: [
              {
                "variant.color": item.variant.color,
                "variant.type": item.variant.type,
              },
              { "size.size": item.variant.size },
            ],
          }
        );
      }

      const orderItems = await Promise.all(
        items.map(async (i) => {
          const product = await productsCol.findOne(
            { _id: new ObjectId(i.productId) },
            { session }
          );

          return {
            productId: new ObjectId(i.productId),
            productName: product?.name ?? "Producto eliminado",
            productImage: product?.images?.[0]?.url ?? null,
            variant: {
              ...i.variant,
              quantity: i.quantity,
            },
            unitPrice: i.variant.price,
            subtotal: i.variant.price * i.quantity,
          };
        })
      );

      const insertRes = await ordersCol.insertOne(
        {
          userId: new ObjectId(userId),
          items: orderItems,
          total,
          status: "pending",
          createdAt: new Date(),
        },
        { session }
      );

      orderData = { _id: insertRes.insertedId, items: orderItems, total };
    });

    return orderData;
  } catch (err) {
    console.error("Error creando orden:", err);
    throw new Error(`Error creando la orden: ${err}`);
  } finally {
    await session.endSession();
  }
}

export async function getAllOrders() {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  const orders = await ordersCol
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(orders));
}

export async function getOrderById(orderId: string): Promise<any | null> {
  const client = await clientPromise;
  const db = client.db("test");

  const orders = await db
    .collection("orders")
    .aggregate([
      { $match: { _id: new ObjectId(orderId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ])
    .toArray();

  if (!orders[0]) return null;

  const raw = JSON.parse(JSON.stringify(orders[0]));

  return {
    ...raw,
    _id: raw._id.toString(),
    user: {
      _id: raw.user._id.toString(),
      name: raw.user.name,
      email: raw.user.email,
    },
    items: raw.items.map((item: any) => {
      const product = raw.products.find(
        (p: any) => p._id.toString() === item.productId.toString()
      );

      return {
        ...item,
        product: product
          ? {
              ...product,
              _id: product._id.toString(),
            }
          : null,
      };
    }),

    total: Number(raw.total),
    paidAmount: Number(raw.paidAmount),
    remainingAmount: Number(raw.total) - Number(raw.paidAmount),
  };
}

export async function getOrdersByUser(userId: string) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  const orders = await ordersCol
    .aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(orders));
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  const result = await ordersCol.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status } }
  );

  return result.modifiedCount === 1;
}

export async function updateOrderItems(orderId: string, items: any[]) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  const total = items.reduce((acc, i) => acc + i.variant.price * i.quantity, 0);

  const orderItems = items.map((i) => ({
    productId: new ObjectId(i.productId),
    variant: {
      ...i.variant,
      quantity: i.quantity,
    },
  }));

  const result = await ordersCol.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { items: orderItems, total } }
  );

  return result.modifiedCount === 1;
}

export async function updateOrderAdmin(formData: FormData) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

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

  const result = await ordersCol.updateOne(
    { _id: new ObjectId(orderId) },
    { $set: data }
  );

  if (result.modifiedCount === 0) throw new Error("Orden no encontrada");

  redirect("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  await ordersCol.deleteOne({ _id: new ObjectId(orderId) });

  return { success: true };
}
