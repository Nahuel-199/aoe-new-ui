import AdminApp from "@/_components/admin/mobile/AdminApp";
import { getProducts } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";
import { getSubcategories } from "@/lib/actions/subcategory.actions";
import { getAllOrders } from "@/lib/actions/order.actions";
import { getCustomOrders } from "@/lib/actions/customOrder.action";
import { getShippingZones } from "@/lib/actions/shippingZone.actions";

export default async function AdminPage() {
  const [
    { products },
    categories,
    subcategories,
    orders,
    customOrdersResponse,
    shippingZones,
  ] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
    getAllOrders(),
    getCustomOrders(),
    getShippingZones(),
  ]);

  const customOrders = customOrdersResponse?.data || [];

  return (
    <AdminApp
      products={products}
      categories={categories}
      subcategories={subcategories}
      orders={orders}
      customOrders={customOrders}
      shippingZones={shippingZones}
    />
  );
}
