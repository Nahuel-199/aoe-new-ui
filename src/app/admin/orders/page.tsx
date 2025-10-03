import { getAllOrders } from "@/lib/actions/order.actions";
import ListOrders from "@/_components/admin/orders/ListOrders";

export default async function Page() {

    const orders = await getAllOrders();
    console.log("ORDER LIST", orders)

    return <ListOrders orders={orders} />;
}
