import CustomOrderList from "@/_components/admin/customOrders/CustomOrderList";
import { getCustomOrders } from "@/lib/actions/customOrder.action";
import { CustomOrder } from "@/types/customOrder.types";

export default async function Page() {
  const { success, data } = await getCustomOrders();

  if (!success || !data) {
    return <div>Error al cargar las órdenes</div>;
  }

  return (
    <div>
      <CustomOrderList orders={data as CustomOrder[]} />
    </div>
  );
}
