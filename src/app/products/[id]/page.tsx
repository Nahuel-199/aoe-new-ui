import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import ProductDetails from "@/_components/products/id/ProductDetails";
import { getProductById } from "@/lib/actions/product.actions";
import { cldUrl } from "@/utils/cloudinaryImage";
import {
  SITE_NAME,
  SITE_URL,
  jsonLd,
  pageMetadata,
  productDescription,
  productImages,
  productPrice,
} from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// generateMetadata y la página comparten la misma consulta por request.
const loadProduct = cache(async (id: string) =>
  ObjectId.isValid(id) ? getProductById(id) : null
);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return { title: "Producto no encontrado", robots: { index: false } };

  const title = product.category?.name
    ? `${product.name} – ${product.category.name}`
    : product.name;

  return pageMetadata({
    title,
    description: productDescription(product),
    path: `/products/${product._id}`,
    images: productImages(product)
      .slice(0, 4)
      .map((url) => ({ url: cldUrl(url, 1200), alt: product.name })),
  });
}

const Page = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) notFound();

  const url = `${SITE_URL}/products/${product._id}`;
  const category = product.category?.name;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": url,
    productGroupID: product._id,
    name: product.name,
    description: productDescription(product),
    url,
    image: productImages(product).slice(0, 10),
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(category ? { category } : {}),
    variesBy: ["https://schema.org/color", "https://schema.org/size"],
    hasVariant: product.variants.flatMap((variant) =>
      variant.sizes.map((s) => ({
        "@type": "Product",
        sku: `${product._id}-${variant.type}-${variant.color}-${s.size}`,
        name: `${product.name} ${variant.type} ${variant.color} talle ${s.size}`,
        color: variant.color,
        size: s.size,
        image: variant.images.map((img) => img.url),
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "ARS",
          price: productPrice(variant),
          availability:
            s.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      }))
    ),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: `${SITE_URL}/products` },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category,
              item: `${SITE_URL}/products?category=${encodeURIComponent(category)}`,
            },
          ]
        : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productJsonLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd)} />
      <ProductDetails product={product} />
    </>
  );
};

export default Page;
