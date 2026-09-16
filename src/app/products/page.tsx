import ProductsSection from "@/_components/products/ProductsSection";
import { getCategories } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";
import { Category, PRODUCTS_PAGE_SIZE, ProductSort } from "@/types/product.types";

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
