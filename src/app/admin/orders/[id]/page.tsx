import OrderById from "@/_components/admin/orders/OrderById";
import { getOrderById } from "@/lib/actions/order.actions";


interface OrdersPageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: OrdersPageProps) => {

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const order = await getOrderById(id);

  if (!order) {
    return <p>Error al cargar la orden.</p>;
  }

  return <OrderById orders={order} />;
};

export default Page;