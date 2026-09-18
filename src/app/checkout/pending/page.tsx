import { FiClock } from "react-icons/fi";
import CheckoutStatusCard from "@/_components/checkout/CheckoutStatusCard";

export default function CheckoutPendingPage() {
  return (
    <CheckoutStatusCard
      icon={<FiClock />}
      iconColor="aoe.textMuted"
      title="Pago en proceso"
      description="Tu pago está siendo procesado por Mercado Pago. Te vamos a avisar apenas se confirme, podés seguir el estado desde tus pedidos."
    />
  );
}
