"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentUserId } from "./auth-wrapper";
import { CartItem } from "@/types/cart.types";
import { Variant } from "@/types/product.types";
import { revalidatePath } from "next/cache";
import { deepSerialize } from "@/lib/serialize";
import { ShippingAddress } from "@/types/address.types";
import { CustomerOrder, AdminOrder } from "@/types/order.types";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { MEETING_POINTS } from "@/lib/constants/meetingPoints";

export async function createOrder({
  items,
  deliveryMethod = "punto_encuentro",
  shippingAddress,
  meetingAddress,
  phoneNumber,
}: {
  items: CartItem[];
  deliveryMethod?: "correo" | "punto_encuentro";
  shippingAddress?: ShippingAddress;
  meetingAddress?: string;
  phoneNumber?: string;
}) {
  if (
    deliveryMethod === "punto_encuentro" &&
    !MEETING_POINTS.includes(meetingAddress as (typeof MEETING_POINTS)[number])
  ) {
    throw new Error("Elegí un punto de encuentro válido");
  }

  const client = await clientPromise;

  const db = client.db("test");

  const productsCol = db.collection("products");
  const ordersCol = db.collection("orders");

  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Usuario no autenticado");

  const itemsSubtotal = items.reduce(
    (acc, i) => acc + i.variant.price * i.quantity,
    0
  );

  // El costo de envío se calcula siempre en el servidor (nunca se confía en un
  // valor mandado por el cliente) para que no se pueda manipular el total.
  let deliveryCost = 0;
  if (deliveryMethod === "correo" && itemsSubtotal < FREE_SHIPPING_THRESHOLD) {
    if (!shippingAddress) throw new Error("Falta la dirección de envío");

    const { getShippingCost } = await import("./shippingZone.actions");
    const costResult = await getShippingCost({
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode,
    });

    if (!costResult.success) throw new Error(costResult.message);
    deliveryCost = costResult.cost;
  }

  const session = client.startSession();

  try {
    let orderData: any = null;

    await session.withTransaction(async () => {
      const total = itemsSubtotal + deliveryCost;

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

          const unitPrice = Number(i.variant.price);

          return {
            productId: new ObjectId(i.productId),
            productName: product?.name ?? "Producto eliminado",
            productImage: product?.images?.[0]?.url ?? null,
            variant: {
              ...i.variant,
              price: unitPrice,
              quantity: i.quantity,
            },
            unitPrice,
            subtotal: unitPrice * i.quantity,
          };
        })
      );

      const insertRes = await ordersCol.insertOne(
        {
          userId: new ObjectId(userId),
          items: orderItems,
          total,
          status: "pending",
          paymentStatus: "pending",
          deliveryMethod,
          deliveryCost,
          shippingAddress,
          meetingAddress,
          phoneNumber,
          createdAt: new Date(),
        },
        { session }
      );

      orderData = { _id: insertRes.insertedId, items: orderItems, total };
    });

    return deepSerialize(orderData);
  } catch (err) {
    console.error("Error creando orden:", err);
    throw new Error(`Error creando la orden: ${err}`);
  } finally {
    await session.endSession();
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/mis-pedidos");
  }
}

export async function getAllOrders(): Promise<AdminOrder[]> {
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
      { $sort: { createdAt: -1 } },
    ])
    .toArray();

  return deepSerialize(orders);
}

export async function getOrdersByUser(userId: string): Promise<CustomerOrder[]> {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  const orders = await ordersCol
    .aggregate([{ $match: { userId: new ObjectId(userId) } }, { $sort: { createdAt: -1 } }])
    .toArray();

  return deepSerialize(orders);
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

  if (result.modifiedCount === 1) {
    const order = await ordersCol.findOne({ _id: new ObjectId(orderId) });
    if (order) {
      const statusMap: Record<string, string> = {
        pending: "Pendiente",
        confirmed: "Confirmada",
        shipped: "En camino",
        delivered: "Entregada",
        cancelled: "Cancelada",
      };

      const statusText = statusMap[status] || status;

      const { createNotification } = await import("./notification.actions");
      await createNotification(
        order.userId.toString(),
        `El estado de tu orden ha cambiado a: ${statusText}`,
        orderId
      );
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/mis-pedidos");
  revalidatePath(`/orders/${orderId}`);

  return result.modifiedCount === 1;
}

/** Devuelve el documento de orden tal cual está en la colección, sin joins. */
export async function getOrderRaw(orderId: string) {
  const client = await clientPromise;
  const db = client.db("test");

  const order = await db
    .collection("orders")
    .findOne({ _id: new ObjectId(orderId) });

  return order ? deepSerialize(order) : null;
}

/** Asocia la preferencia de Mercado Pago recién creada a la orden. */
export async function attachPaymentPreference(
  orderId: string,
  preferenceId: string
) {
  const client = await clientPromise;
  const db = client.db("test");

  await db.collection("orders").updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        paymentProvider: "mercadopago",
        paymentPreferenceId: preferenceId,
      },
    }
  );
}

/**
 * Marca la orden como pagada a partir de una notificación aprobada de Mercado Pago.
 * Idempotente: si la orden ya fue confirmada por un webhook anterior, no hace nada.
 */
export async function confirmOrderPayment(orderId: string, paymentId: string) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  // Mercado Pago cobra el total de la orden de una sola vez en el checkout,
  // así que al aprobarse el pago se da por saldado el total (evita que quede
  // como "saldo pendiente" hasta que un admin lo complete a mano).
  const result = await ordersCol.updateOne(
    { _id: new ObjectId(orderId), paymentStatus: { $ne: "approved" } },
    [
      {
        $set: {
          paymentStatus: "approved",
          paymentId,
          status: "confirmed",
          paidAmount: "$total",
        },
      },
    ]
  );

  if (result.modifiedCount === 1) {
    const order = await ordersCol.findOne({ _id: new ObjectId(orderId) });
    if (order) {
      const { createNotification } = await import("./notification.actions");
      await createNotification(
        order.userId.toString(),
        "¡Tu pago fue aprobado! Ya estamos preparando tu pedido.",
        orderId
      );
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/mis-pedidos");

  return result.modifiedCount === 1;
}

/**
 * Marca la orden como rechazada/cancelada y repone el stock reservado.
 * Idempotente: si la orden ya está cancelada/rechazada, no vuelve a reponer stock.
 */
export async function cancelOrderAndRestoreStock(
  orderId: string,
  paymentStatus: "rejected" | "cancelled" | "refunded"
) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");
  const productsCol = db.collection("products");

  const session = client.startSession();

  try {
    let restored = false;

    await session.withTransaction(async () => {
      const order = await ordersCol.findOne(
        {
          _id: new ObjectId(orderId),
          paymentStatus: { $nin: ["rejected", "cancelled", "refunded"] },
        },
        { session }
      );

      if (!order) return;

      for (const item of order.items) {
        await productsCol.updateOne(
          {
            _id: item.productId,
            "variants.color": item.variant.color,
            "variants.type": item.variant.type,
            "variants.sizes.size": item.variant.size,
          },
          {
            $inc: {
              "variants.$[variant].sizes.$[size].stock": item.variant.quantity,
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

      await ordersCol.updateOne(
        { _id: order._id },
        { $set: { paymentStatus, status: "cancelled" } },
        { session }
      );

      restored = true;
    });

    return restored;
  } finally {
    await session.endSession();
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/mis-pedidos");
  }
}

export async function deleteOrder(orderId: string) {
  const client = await clientPromise;
  const db = client.db("test");
  const ordersCol = db.collection("orders");

  await ordersCol.deleteOne({ _id: new ObjectId(orderId) });

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/mis-pedidos");

  return { success: true };
}
