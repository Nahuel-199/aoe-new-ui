import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Se regenera como máximo una vez por hora para reflejar productos nuevos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb();
  const [products, categories] = await Promise.all([
    db
      .collection("products")
      .find({}, { projection: { _id: 1, updatedAt: 1, createdAt: 1, variants: 1 } })
      .toArray(),
    db.collection("categories").find({}, { projection: { name: 1 } }).toArray(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/products?category=Ofertas`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/personalizados`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/products?category=${encodeURIComponent(c.name)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p._id.toString()}`,
    lastModified: p.updatedAt ?? p.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
    images: (p.variants ?? [])
      .flatMap((v: { images?: { url: string }[] }) => v.images ?? [])
      .map((img: { url: string }) => img.url)
      .slice(0, 5),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
