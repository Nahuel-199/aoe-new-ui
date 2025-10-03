import { getOrdersByUser } from "@/lib/actions/order.actions";
import { getCurrentUserId } from "@/lib/actions/auth-wrapper";
import OrdersByUser from "@/_components/orders/OrdersByUser";

export default async function Page() {
    const userId = await getCurrentUserId();
    if (!userId) {
        return <div>Tenés que iniciar sesión para ver tus pedidos.</div>;
    }

    const orders = await getOrdersByUser(userId);

    return <OrdersByUser orders={orders} />;
}
