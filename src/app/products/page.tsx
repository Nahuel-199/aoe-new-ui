import ProductsSection from "@/_components/products/ProductsSection";
import { getCategories } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";

export default async function Page() {
  const products = await getProducts();
  const categories = await getCategories();
  const subcategories = await getSubcategories();

  return <ProductsSection 
  products={products} 
  categories={categories} 
  subcategories={subcategories} 
  />;
}