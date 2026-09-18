import { Box, Text } from "@chakra-ui/react";
import { getFavoriteProducts } from "@/lib/actions/favorite.actions";
import { getCurrentUserId } from "@/lib/actions/auth-wrapper";
import FavoritesGrid from "@/_components/products/FavoritesGrid";

export default async function Page() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center" textAlign="center" px={6}>
        <Text color="aoe.textSubtle" fontSize="sm">
          Tenés que iniciar sesión para ver tus favoritos.
        </Text>
      </Box>
    );
  }

  const products = await getFavoriteProducts();

  return (
    <Box maxW="1360px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 9, md: "36px" }} pb="80px">
      <Text
        fontFamily="mono"
        fontSize="11px"
        color="aoe.textFaint"
        letterSpacing="0.12em"
        textTransform="uppercase"
        mb="14px"
      >
        Inicio / Mi cuenta / Favoritos
      </Text>
      <Text
        fontFamily="heading"
        fontSize={{ base: "36px", md: "clamp(36px, 7vw, 76px)" }}
        lineHeight="0.9"
        textTransform="uppercase"
        color="aoe.text"
        mb="6px"
      >
        Mis <Text as="span" color="aoe.red">favoritos</Text>
      </Text>
      <Text color="aoe.textSubtle" fontSize="15px" mb="26px" maxW="520px" lineHeight="1.5">
        Todo lo que marcaste con el corazón, en un solo lugar.
      </Text>

      <FavoritesGrid products={products} />
    </Box>
  );
}
