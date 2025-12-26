import { Box } from "@chakra-ui/react";
import AdminDashboardContainer from "@/_components/admin/dashboard/AdminDashboardContainer";
import { getProducts } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";
import { getAllOrders } from "@/lib/actions/order.actions";
import { getCustomOrders } from "@/lib/actions/customOrder.action";

export default async function AdminLayout() {
  // Fetch all data in parallel
  const [products, categories, subcategories, ordersResponse, customOrdersResponse] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
    getAllOrders(),
    getCustomOrders(),
  ]);

  // Extract data from responses
  const orders = ordersResponse || [];
  const customOrders = customOrdersResponse?.data || [];

  return (
    <Box w="full" minH="100vh">
      <AdminDashboardContainer
        products={products}
        categories={categories}
        subcategories={subcategories}
        orders={orders}
        customOrders={customOrders}
      />
    </Box>
  );
}
