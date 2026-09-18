import { FiCheckCircle } from "react-icons/fi";
import CheckoutStatusCard from "@/_components/checkout/CheckoutStatusCard";
import { verifyAndConfirmPayment } from "@/lib/actions/payment.actions";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; payment_id?: string }>;
}) {
  const { orderId, payment_id: paymentId } = await searchParams;

  if (orderId) {
    await verifyAndConfirmPayment(orderId, paymentId);
  }

  return (
    <CheckoutStatusCard
      icon={<FiCheckCircle />}
      iconColor="aoe.text"
      title="¡Pago aprobado!"
      description="Ya confirmamos tu pago con Mercado Pago. En breve vas a ver el pedido actualizado y nos pondremos en contacto para coordinar la entrega."
    />
  );
}
