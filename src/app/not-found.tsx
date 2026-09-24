import type { Metadata } from "next";
import NextLink from "next/link";
import { Box, Button, Text } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Box
      minH="60vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={6}
      py={16}
    >
      <Text fontFamily="mono" fontSize="11px" color="aoe.red" letterSpacing="0.14em" textTransform="uppercase">
        Error 404
      </Text>
      <Text
        as="h1"
        fontFamily="heading"
        fontSize={{ base: "36px", md: "56px" }}
        lineHeight="0.94"
        textTransform="uppercase"
        color="aoe.text"
        mt="10px"
      >
        No encontramos esta página
      </Text>
      <Text color="aoe.textSubtle" fontSize="14px" mt={4} mb={8} maxW="420px">
        Puede que el producto ya no esté disponible o que el link sea incorrecto.
      </Text>
      <Button asChild bg="aoe.red" color="white" borderRadius="pill" px={6} _hover={{ opacity: 0.9 }}>
        <NextLink href="/products">Ver el catálogo</NextLink>
      </Button>
    </Box>
  );
}
