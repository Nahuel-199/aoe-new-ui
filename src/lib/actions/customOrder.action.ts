"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ImageSchema = z.object({
  id: z.string().min(1, "ID de imagen requerido"),
  url: z.string().url("URL inválida"),
});

const customOrderItemSchema = z.object({
  name: z.string().min(1, "Nombre del producto requerido"),
  description: z.string().optional(),
  images: z.array(ImageSchema).default([]),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.coerce.number().min(1, "Cantidad mínima 1"),
  price: z.coerce.number().min(0, "Precio mínimo 0"),
});

const customOrderSchema = z.object({
  clientName: z.string().min(1, "Nombre del cliente requerido"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  items: z
    .array(customOrderItemSchema)
    .min(1, "Debe agregar al menos un producto"),
  total: z.coerce.number().min(0),
  remainingAmount: z.coerce.number().min(0).optional(),
  paidAmount: z.coerce.number().min(0).optional(),
  deliveryCost: z.coerce.number().min(0).optional(),
  deliveryMethod: z.string().optional(),
  shippingAddress: z.string().optional(),
  meetingAddress: z.string().optional(),
  status: z
    .enum(["pending", "in_progress", "completed", "cancelled"])
    .default("pending"),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
  comments: z.string().optional(),
  designNotes: z.string().optional(),
  designReferences: z.array(ImageSchema).default([]),
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;
export type CustomOrder = CustomOrderInput & { _id: string; createdAt: string };

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
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      items,
      total: Number(formData.get("total")),
      remainingAmount: Number(formData.get("remainingAmount")) || 0,
      paidAmount: Number(formData.get("paidAmount")) || 0,
      deliveryCost: Number(formData.get("deliveryCost")) || 0,
      deliveryMethod: formData.get("deliveryMethod"),
      shippingAddress: formData.get("shippingAddress"),
      meetingAddress: formData.get("meetingAddress"),
      status: formData.get("status"),
      paymentStatus: formData.get("paymentStatus"),
      comments: formData.get("comments"),
      designNotes: formData.get("designNotes"),
      designReferences: [],
    };

    const validated = customOrderSchema.parse(data);

    const client = await clientPromise;
    const db = client.db("test");
    const col = db.collection("customOrders");

    const now = new Date();

    const res = await col.insertOne({
      ...validated,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin/custom-orders");
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
    const client = await clientPromise;
    const db = client.db("test");

    const orders = await db
      .collection("customOrders")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = orders.map((order: any) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString() ?? "",
    }));

    return { success: true, data: serialized };
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
    const client = await clientPromise;
    const db = client.db("test");

    const order = await db
      .collection("customOrders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) return { success: false, message: "Orden no encontrada" };

    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("💥 Error al obtener orden:", error);
    return { success: false, message: "Error al obtener la orden" };
  }
}

export async function getCustomOrdersByStatus(status: string) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    const orders = await db
      .collection("customOrders")
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al filtrar las órdenes" };
  }
}
