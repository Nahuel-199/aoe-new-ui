import type { Metadata } from "next";
import type { Product } from "@/types/product.types";

export const SITE_URL = "https://www.aoe-indumentaria.com";
export const SITE_NAME = "AOE Indumentaria";
export const SITE_DESCRIPTION =
  "Remeras y buzos de anime, rock y series con estampas propias. Algodón peinado, talles reales y envíos a todo el país. Comprá online en AOE Indumentaria.";
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export const SOCIAL_LINKS = [
  "https://www.instagram.com/aoe_indumentaria",
  "https://wa.me/5491124969558",
];

/** Páginas que no deben aparecer en buscadores (privadas, búsquedas, checkout). */
export const NO_INDEX: Metadata["robots"] = { index: false, follow: true };

interface PageMetadataInput {
  title: string;
  description?: string;
  path: string;
  images?: { url: string; alt?: string }[];
  noIndex?: boolean;
}

/**
 * Metadata por página. Next hace merge superficial entre segmentos, así que
 * openGraph/twitter se arman completos acá para no perder la imagen ni el
 * título del layout raíz.
 */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  images = [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  noIndex,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
    ...(noIndex ? { robots: NO_INDEX } : {}),
  };
}

export function productPrice(variant: Product["variants"][number]) {
  return variant.is_offer && variant.price_offer ? variant.price_offer : variant.price;
}

/**
 * Siempre arranca con el nombre del producto: muchas descripciones cargadas son
 * genéricas y se repiten, y Google penaliza descripciones duplicadas.
 */
export function productDescription(product: Product) {
  const types = Array.from(new Set(product.variants.map((v) => v.type))).join(", ");
  const colors = Array.from(new Set(product.variants.map((v) => v.color))).join(", ");
  const text =
    product.description?.trim() ||
    `Comprá online en ${SITE_NAME} con envíos a todo el país.`;

  const full = `${product.name}${types ? ` (${types})` : ""}${
    colors ? `, color ${colors}` : ""
  }. ${text}`;
  return full.length > 160 ? full.slice(0, 157).trimEnd() + "…" : full;
}

export function productImages(product: Product) {
  return product.variants.flatMap((v) => v.images.map((img) => img.url)).filter(Boolean);
}

/** Serializa JSON-LD escapando "<" para que no pueda cerrar el <script>. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
