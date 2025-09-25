import NewProduct from "@/_components/admin/products/NewProduct";
import { getCategories } from "@/lib/actions/category.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";

export default async function NewProductPage() {
  const categories = await getCategories();
  const subcategories = await getSubcategories();

  return (
    <NewProduct categories={categories} subcategories={subcategories} />
  );
}
