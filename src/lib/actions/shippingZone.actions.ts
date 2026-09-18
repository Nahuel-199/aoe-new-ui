"use server";

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deepSerialize } from "@/lib/serialize";
import {
  shippingZoneSchema,
  type ShippingZone,
  type ShippingZoneInput,
} from "@/types/shippingZone.types";

function revalidateShippingPaths() {
  revalidatePath("/admin");
  revalidatePath("/checkout");
}

export async function createShippingZone(data: ShippingZoneInput) {
  try {
    const validated = shippingZoneSchema.parse(data);
    const db = await getDb();

    const now = new Date();
    await db.collection("shippingZones").insertOne({
      ...validated,
      createdAt: now,
      updatedAt: now,
    });

    revalidateShippingPaths();
    return { success: true, message: "Zona de envío creada correctamente" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues.map((i) => i.message).join(", "),
      };
    }
    console.error("Error creando zona de envío:", error);
    return { success: false, message: "Error al crear la zona de envío" };
  }
}

export async function updateShippingZone(id: string, data: ShippingZoneInput) {
  try {
    const validated = shippingZoneSchema.parse(data);
    const db = await getDb();

    await db.collection("shippingZones").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...validated, updatedAt: new Date() } }
    );

    revalidateShippingPaths();
    return { success: true, message: "Zona de envío actualizada correctamente" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues.map((i) => i.message).join(", "),
      };
    }
    console.error("Error actualizando zona de envío:", error);
    return { success: false, message: "Error al actualizar la zona de envío" };
  }
}

export async function deleteShippingZone(id: string) {
  try {
    const db = await getDb();
    const result = await db
      .collection("shippingZones")
      .deleteOne({ _id: new ObjectId(id) });

    revalidateShippingPaths();
    return { success: result.deletedCount === 1 };
  } catch (error) {
    console.error("Error eliminando zona de envío:", error);
    return { success: false, message: "Error al eliminar la zona de envío" };
  }
}

export async function getShippingZones(): Promise<ShippingZone[]> {
  const db = await getDb();
  const zones = await db
    .collection("shippingZones")
    .find()
    .sort({ name: 1 })
    .toArray();

  return deepSerialize(zones);
}

/**
 * Calcula el costo de envío para una dirección dada.
 * Prioriza el match por rango de código postal (más específico) y, si no
 * hay ninguno, cae a un match por provincia.
 */
export async function getShippingCost({
  province,
  postalCode,
}: {
  province: string;
  postalCode: string;
}): Promise<
  | { success: true; cost: number; zoneName: string }
  | { success: false; message: string }
> {
  const db = await getDb();
  const zones = await db.collection("shippingZones").find().toArray();

  const pc = parseInt(postalCode.replace(/\D/g, ""), 10);

  const byRange = zones.find(
    (z) =>
      typeof z.postalCodeFrom === "number" &&
      typeof z.postalCodeTo === "number" &&
      !Number.isNaN(pc) &&
      pc >= z.postalCodeFrom &&
      pc <= z.postalCodeTo
  );
  if (byRange) {
    return { success: true, cost: byRange.cost, zoneName: byRange.name };
  }

  const byProvince = zones.find((z) => z.provinces?.includes(province));
  if (byProvince) {
    return { success: true, cost: byProvince.cost, zoneName: byProvince.name };
  }

  return {
    success: false,
    message: "No tenemos una zona de envío configurada para esa dirección todavía.",
  };
}
