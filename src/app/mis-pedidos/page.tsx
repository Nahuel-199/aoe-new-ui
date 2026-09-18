import { Box, Text } from "@chakra-ui/react";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { getCurrentUserId } from "@/lib/actions/auth-wrapper";
import OrdersByUser from "@/_components/orders/OrdersByUser";

export default async function Page() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center" textAlign="center" px={6}>
        <Text color="aoe.textSubtle" fontSize="sm">
          Tenés que iniciar sesión para ver tus pedidos.
        </Text>
      </Box>
    );
  }

  const orders = await getOrdersByUser(userId);

  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 9, md: "36px" }} pb="80px">
      <Text
        fontFamily="mono"
        fontSize="11px"
        color="aoe.textFaint"
        letterSpacing="0.12em"
        textTransform="uppercase"
        mb="14px"
      >
        Inicio / Mi cuenta / Pedidos
      </Text>
      <Text
        fontFamily="heading"
        fontSize={{ base: "36px", md: "clamp(36px, 7vw, 76px)" }}
        lineHeight="0.9"
        textTransform="uppercase"
        color="aoe.text"
        mb="6px"
      >
        Mis <Text as="span" color="aoe.red">pedidos</Text>
      </Text>
      <Text color="aoe.textSubtle" fontSize="15px" mb="26px" maxW="520px" lineHeight="1.5">
        Seguí el estado de cada compra. Te avisamos por email en cada cambio.
      </Text>

      <OrdersByUser orders={orders} />
    </Box>
  );
}
