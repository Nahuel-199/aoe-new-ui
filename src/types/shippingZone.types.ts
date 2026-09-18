import { z } from "zod";
import { ARGENTINE_PROVINCES } from "@/lib/constants/provinces";

export const shippingZoneSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  provinces: z.array(z.enum(ARGENTINE_PROVINCES)).min(1, "Elegí al menos una provincia"),
  postalCodeFrom: z.number().int().positive().optional(),
  postalCodeTo: z.number().int().positive().optional(),
  cost: z.number().nonnegative("El costo no puede ser negativo"),
});

export type ShippingZoneInput = z.infer<typeof shippingZoneSchema>;

export interface ShippingZone extends ShippingZoneInput {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}
