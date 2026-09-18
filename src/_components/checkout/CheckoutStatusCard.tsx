"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface CheckoutStatusCardProps {
  icon: ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

export default function CheckoutStatusCard({
  icon,
  iconColor,
  title,
  description,
}: CheckoutStatusCardProps) {
  const router = useRouter();

  return (
    <Box
      minH="70vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={6}
      py={16}
      gap={4}
    >
      <Box fontSize="56px" color={iconColor} lineHeight={0}>
        {icon}
      </Box>
      <Text fontFamily="heading" fontSize="2xl" textTransform="uppercase" color="aoe.text">
        {title}
      </Text>
      <Text color="aoe.textSubtle" fontSize="sm" maxW="420px">
        {description}
      </Text>
      <Button
        onClick={() => router.push("/mis-pedidos")}
        mt={4}
        bg="aoe.text"
        color="aoe.bg"
        borderRadius="pill"
        h="46px"
        px={6}
        fontFamily="mono"
        fontSize="xs"
        letterSpacing="0.08em"
        textTransform="uppercase"
        _hover={{ bg: "aoe.red", color: "white" }}
      >
        Ver mis pedidos
      </Button>
    </Box>
  );
}
