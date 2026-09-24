import type { Metadata } from "next";
import ProductsSection from "@/_components/products/ProductsSection";
import { getCategories } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";
import { Category, PRODUCTS_PAGE_SIZE, ProductSort } from "@/types/product.types";
import { pageMetadata } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
    sort?: string;
  }>;
}

const SORT_OPTIONS: ProductSort[] = ["relevancia", "menor", "mayor"];

function resolveCategory(raw: string | undefined, categories: Category[]) {
  if (!raw) return { categoryId: undefined, onlyOffers: false, label: undefined };
  if (raw.toLowerCase() === "ofertas") {
    return { categoryId: undefined, onlyOffers: true, label: "Ofertas" };
  }
  const match = categories.find((c) => c.name.toLowerCase() === raw.toLowerCase());
  return { categoryId: match?._id, onlyOffers: false, label: match?.name };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categories = await getCategories();
  const { label } = resolveCategory(params.category, categories);

  const path = label ? `/products?category=${encodeURIComponent(label)}` : "/products";
  const title = label ?? "Catálogo";
  const description = label === "Ofertas"
    ? "Remeras y buzos en oferta con estampas de anime, rock y series. Aprovechá los descuentos de AOE Indumentaria."
    : label
      ? `${label} con estampas de anime, rock y series. Algodón peinado, talles reales y envíos a todo el país.`
      : "Catálogo completo de remeras y buzos de anime, rock y series. Estampas propias, algodón peinado y talles reales.";

  return pageMetadata({
    title: params.q ? `Resultados para "${params.q}"` : title,
    description,
    path,
    // Búsquedas y filtros por subcategoría son combinaciones infinitas: no indexar,
    // pero sí seguir los links a los productos.
    ...(params.q || params.subcategory ? { noIndex: true } : {}),
  });
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, subcategories] = await Promise.all([
    getCategories(),
    getSubcategories(),
  ]);

  const { categoryId, onlyOffers, label } = resolveCategory(params.category, categories);
  const sort: ProductSort = SORT_OPTIONS.includes(params.sort as ProductSort)
    ? (params.sort as ProductSort)
    : "relevancia";

  const { products, total } = await getProducts({
    page: 1,
    pageSize: PRODUCTS_PAGE_SIZE,
    category: categoryId,
    subcategory: params.subcategory,
    search: params.q,
    sort,
    onlyOffers,
  });

  return (
    <ProductsSection
      products={products}
      total={total}
      categories={categories}
      subcategories={subcategories}
      filters={{
        categoryId,
        onlyOffers,
        categoryLabel: label,
        subcategoryId: params.subcategory,
        search: params.q ?? "",
        sort,
      }}
    />
  );
}
