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

export const customOrderSchema = z.object({
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

export type Image = z.infer<typeof ImageSchema>;
export type CustomOrderItem = z.infer<typeof customOrderItemSchema>;
export type CustomOrderInput = z.infer<typeof customOrderSchema>;
export type CustomOrder = CustomOrderInput & { _id: string; createdAt: string };
