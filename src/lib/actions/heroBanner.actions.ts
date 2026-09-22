"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/utils/deleteCloudinary";
import type { HeroBanner } from "@/types/heroBanner.types";

const SETTINGS_ID = "heroBanners";
const SLOT_COUNT = 4;
const EMPTY_SLOTS: null[] = Array(SLOT_COUNT).fill(null);

interface HeroSettingsDoc {
  _id: string;
  images: (HeroBanner | null)[];
  updatedAt: Date;
}

function revalidateHeroPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
}

/**
 * `$set: {"images.N": ...}` sobre un documento que todavía no existe crea
 * `images` como *objeto* (`{"0": ...}`) en vez de array, porque Mongo no
 * infiere el tipo array a partir de una key numérica en un `$set` — sólo lo
 * hace si el campo ya es un array. Este paso lo garantiza (vacío si hace
 * falta) antes de tocar una posición puntual, para que `images` sea siempre
 * un array real de 4 elementos.
 */
async function ensureDoc() {
  const db = await getDb();
  await db
    .collection<HeroSettingsDoc>("settings")
    .updateOne({ _id: SETTINGS_ID }, { $setOnInsert: { images: EMPTY_SLOTS } }, { upsert: true });
  return db.collection<HeroSettingsDoc>("settings");
}

/**
 * Las 4 imágenes se guardan en un único documento (`settings/heroBanners`)
 * como un array de posiciones fijas, en vez de una colección con un
 * documento por imagen — simplifica reemplazar/vaciar un slot puntual sin
 * lidiar con orden ni ids sueltos.
 */
export async function getHeroBanners(): Promise<(HeroBanner | null)[]> {
  const db = await getDb();
  const doc = await db.collection<HeroSettingsDoc>("settings").findOne({ _id: SETTINGS_ID });
  // Tolera además el caso de un doc viejo/corrupto donde `images` haya
  // quedado guardado como objeto en vez de array.
  const raw = doc?.images;
  const images: (HeroBanner | null)[] = Array.isArray(raw)
    ? raw
    : raw
    ? Object.values(raw as Record<string, HeroBanner | null>)
    : [];
  return Array.from({ length: SLOT_COUNT }, (_, i) => images[i] || null);
}

export async function setHeroBanner(index: number, banner: HeroBanner) {
  if (index < 0 || index >= SLOT_COUNT) {
    return { success: false, message: "Posición inválida" };
  }
  try {
    const col = await ensureDoc();
    // $set posicional (images.N) en vez de leer todo el array, modificarlo y
    // reescribirlo entero: si se suben dos imágenes casi al mismo tiempo, la
    // segunda escritura podía pisar la primera (perdía el slot recién
    // guardado) porque ambas partían del mismo snapshot leído antes de que
    // la otra terminara de escribir.
    const before = await col.findOneAndUpdate(
      { _id: SETTINGS_ID },
      { $set: { [`images.${index}`]: banner, updatedAt: new Date() } },
      { returnDocument: "before" }
    );
    const previous = before?.images?.[index];

    if (previous?.id && previous.id !== banner.id) {
      await deleteImage(previous.id).catch(() => {});
    }

    revalidateHeroPaths();
    return { success: true, message: "Imagen actualizada" };
  } catch (error) {
    console.error("Error guardando imagen del hero:", error);
    return { success: false, message: "No pudimos guardar la imagen" };
  }
}

export async function setHeroBannerLink(index: number, link: string) {
  if (index < 0 || index >= SLOT_COUNT) {
    return { success: false, message: "Posición inválida" };
  }
  try {
    const col = await ensureDoc();
    // Nota: `{"images.N": {$ne: null}}` NO sirve acá — Mongo evalúa $ne
    // sobre TODO el array cuando el campo es un array (no sólo la posición
    // N), así que si CUALQUIER otro slot es null la condición no matchea
    // aunque images[N] tenga una imagen real. Se valida en JS en su lugar.
    const doc = await col.findOne({ _id: SETTINGS_ID });
    if (!doc?.images?.[index]) {
      return { success: false, message: "Subí una imagen primero" };
    }

    await col.updateOne(
      { _id: SETTINGS_ID },
      { $set: { [`images.${index}.link`]: link || null, updatedAt: new Date() } }
    );

    revalidateHeroPaths();
    return { success: true, message: "Link actualizado" };
  } catch (error) {
    console.error("Error guardando el link del hero:", error);
    return { success: false, message: "No pudimos guardar el link" };
  }
}

export async function removeHeroBanner(index: number) {
  if (index < 0 || index >= SLOT_COUNT) {
    return { success: false, message: "Posición inválida" };
  }
  try {
    const col = await ensureDoc();
    const before = await col.findOneAndUpdate(
      { _id: SETTINGS_ID },
      { $set: { [`images.${index}`]: null, updatedAt: new Date() } },
      { returnDocument: "before" }
    );
    const previous = before?.images?.[index];

    if (previous?.id) {
      await deleteImage(previous.id).catch(() => {});
    }

    revalidateHeroPaths();
    return { success: true, message: "Imagen eliminada" };
  } catch (error) {
    console.error("Error eliminando imagen del hero:", error);
    return { success: false, message: "No pudimos eliminar la imagen" };
  }
}
