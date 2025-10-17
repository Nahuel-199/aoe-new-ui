export const dynamic = "force-dynamic";

import ListProducts from "@/_components/admin/products/ListProducts";
import { getCategories } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";

export default async function Page() {
  const products = await getProducts();
  const categories = await getCategories();
  const subcategories = await getSubcategories();

  return <ListProducts 
  products={products} 
  categories={categories} 
  subcategories={subcategories} 
  />;
}