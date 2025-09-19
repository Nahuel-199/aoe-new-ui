import ListSubcategories from "@/_components/subcategories/ListSubcategories";
import { getSubcategories } from "@/lib/actions/subcategory.actions";

export default async function CategoriesPage() {
  const subcategories = await getSubcategories();

  return <ListSubcategories subcategories={subcategories} />;
}