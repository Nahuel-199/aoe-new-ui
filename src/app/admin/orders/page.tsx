export const dynamic = "force-dynamic";

import { getAllOrders } from "@/lib/actions/order.actions";
import ListOrders from "@/_components/admin/orders/ListOrders";

export default async function Page() {

    const orders = await getAllOrders();

    return <ListOrders orders={orders} />;
}
