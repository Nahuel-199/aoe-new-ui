export const dynamic = "force-dynamic";

import { getCategories } from "@/lib/actions/category.actions";
import ListCategories from "@/_components/admin/categories/ListCategories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <ListCategories categories={categories} />;
}