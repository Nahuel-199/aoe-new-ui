import { getCategories } from "@/lib/actions/category.actions";
import ListCategories from "@/_components/categories/ListCategories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <ListCategories categories={categories} />;
}