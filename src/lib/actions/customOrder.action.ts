"use server";

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deepSerialize } from "@/lib/serialize";
import {
  customOrderSchema,
  type CustomOrder,
  type CustomOrderInput,
} from "@/types/customOrder.types";

export async function createCustomOrder(prevState: any, formData: FormData) {
  try {
    console.log("📩 Recibiendo formData...");

    const items: any[] = [];
    const itemMap: Record<number, any> = {};

    for (const [key, value] of formData.entries()) {
      const match = key.match(/^items\[(\d+)\]\[(.+)\]$/);
      if (match) {
        const [, index, field] = match;
        const idx = Number(index);
        itemMap[idx] = itemMap[idx] || {};
        itemMap[idx][field] = value;
      }
    }

    for (const index in itemMap) {
      const item = itemMap[index];
      items.push({
        name: item.name || "",
        description: item.description || "",
        color: item.color || "",
        size: item.size || "",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        images: [],
      });
    }

    const data = {
      clientName: formData.get("clientName"),
      phoneNumber: formData.get("phoneNumber") || undefined,
      email: formData.get("email") || undefined,
      items,
      total: Number(formData.get("total")),
      remainingAmount: Number(formData.get("remainingAmount")) || 0,
      paidAmount: Number(formData.get("paidAmount")) || 0,
      deliveryCost: Number(formData.get("deliveryCost")) || 0,
      deliveryMethod: formData.get("deliveryMethod") || undefined,
      shippingAddress: formData.get("shippingAddress") || undefined,
      meetingAddress: formData.get("meetingAddress") || undefined,
      status: formData.get("status"),
      paymentStatus: formData.get("paymentStatus"),
      comments: formData.get("comments") || undefined,
      designNotes: formData.get("designNotes") || undefined,
      designReferences: [],
    };

    const validated = customOrderSchema.parse(data);

    const db = await getDb();
    const col = db.collection("customOrders");

    const now = new Date();

    const res = await col.insertOne({
      ...validated,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin/custom-orders");
    revalidatePath("/admin");
    revalidatePath("/personalizados");

    return { success: true, message: "Orden creada exitosamente" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Error de validación:", error.issues);
      return {
        success: false,
        message:
          "Datos inválidos: " + error.issues.map((i) => i.message).join(", "),
      };
    }

    console.error("💥 Error al crear orden:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}

export async function getCustomOrders(): Promise<{
  success: boolean;
  data?: CustomOrder[];
  message?: string;
}> {
  try {
    const db = await getDb();

    const orders = await db
      .collection("customOrders")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, data: deepSerialize(orders) };
  } catch (error) {
    console.error("💥 Error al obtener órdenes:", error);
    return {
      success: false,
      message: "Error al obtener las órdenes personalizadas",
    };
  }
}

export async function getCustomOrderById(id: string) {
  try {
    const db = await getDb();

    const order = await db
      .collection("customOrders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) return { success: false, message: "Orden no encontrada" };

    return { success: true, data: deepSerialize(order) };
  } catch (error) {
    console.error("💥 Error al obtener orden:", error);
    return { success: false, message: "Error al obtener la orden" };
  }
}

export async function getCustomOrdersByStatus(status: string) {
  try {
    const db = await getDb();

    const orders = await db
      .collection("customOrders")
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, data: deepSerialize(orders) };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al filtrar las órdenes" };
  }
}

export async function updateCustomOrder(
  id: string,
  data: Partial<CustomOrderInput>
) {
  try {
    const db = await getDb();

    await db.collection("customOrders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

    revalidatePath("/admin");
    return { success: true, message: "Orden actualizada correctamente" };
  } catch (error) {
    console.error("💥 Error al actualizar orden:", error);
    return { success: false, message: "Error al actualizar la orden" };
  }
}

export async function deleteCustomOrder(id: string) {
  try {
    const db = await getDb();

    const result = await db.collection("customOrders").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Orden no encontrada" };
    }

    revalidatePath("/admin");
    return { success: true, message: "Orden eliminada correctamente" };
  } catch (error) {
    console.error("💥 Error al eliminar orden:", error);
    return { success: false, message: "Error al eliminar la orden" };
  }
}
