import { FiXCircle } from "react-icons/fi";
import CheckoutStatusCard from "@/_components/checkout/CheckoutStatusCard";

export default function CheckoutFailurePage() {
  return (
    <CheckoutStatusCard
      icon={<FiXCircle />}
      iconColor="aoe.red"
      title="No pudimos procesar el pago"
      description="El pago no se completó y liberamos el stock reservado. Podés volver a intentarlo cuando quieras desde tu carrito."
    />
  );
}
