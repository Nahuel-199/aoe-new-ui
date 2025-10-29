"use server";

import { connectDB } from "@/lib/db";
import customOrderModel from "@/models/customOrder.model";
import { CustomOrder } from "@/types/customOrder.types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ImageSchema = z.object({
  id: z.string().min(1, "ID de imagen requerido"),
  url: z.string().url("URL inválida"),
});

const customOrderModelItemSchema = z.object({
  name: z.string().min(1, "Nombre del producto requerido"),
  description: z.string().optional(),
  images: z.array(ImageSchema).default([]),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.coerce.number().min(1, "Cantidad mínima 1"),
  price: z.coerce.number().min(0, "Precio mínimo 0"),
});

const customOrderModelSchema = z.object({
  clientName: z.string().min(1, "Nombre del cliente requerido"),
  phoneNumber: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  items: z
    .array(customOrderModelItemSchema)
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

export type customOrderModelInput = z.infer<typeof customOrderModelSchema>;

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

    const validatedData = customOrderModelSchema.parse(data);

    await connectDB();
    const order = await customOrderModel.create(validatedData);
    revalidatePath("/dashboard/orders");

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

    console.error("💥 Error al crear la orden:", error);
    return { success: false, message: "Error interno del servidor" };
  }
}

export async function getCustomOrders(): Promise<{
  success: boolean;
  data?: CustomOrder[];
  message?: string;
}> {
  try {
    await connectDB();

    const orders = await customOrderModel.find().sort({ createdAt: -1 }).lean();

    const serializedOrders: CustomOrder[] = orders.map((order: any) => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt?.toISOString() ?? "",
    }));

    return { success: true, data: serializedOrders };
  } catch (error) {
    console.error("💥 Error al obtener las órdenes personalizadas:", error);
    return {
      success: false,
      message: "Error al obtener las órdenes personalizadas",
    };
  }
}

export async function getCustomOrderById(id: string) {
  try {
    await connectDB();
    const order = await customOrderModel.findById(id).lean();

    if (!order) {
      return { success: false, message: "Orden no encontrada" };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("💥 Error al obtener la orden:", error);
    return { success: false, message: "Error al obtener la orden" };
  }
}

export async function getCustomOrdersByStatus(status: string) {
  try {
    await connectDB();
    const orders = await customOrderModel
      .find({ status })
      .sort({ createdAt: -1 })
      .lean();
    return { success: true, data: orders };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al filtrar las órdenes" };
  }
}
