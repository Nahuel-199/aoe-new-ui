import { Box, HStack, Skeleton } from "@chakra-ui/react";

export default function MisPedidosLoading() {
  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 9, md: "36px" }} pb="80px">
      <Skeleton height="12px" width="180px" mb="14px" />
      <Skeleton height="40px" width="220px" mb="10px" />
      <Skeleton height="14px" width="320px" mb="26px" />

      <HStack gap={2} mb={6}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height="40px" width="100px" borderRadius="pill" />
        ))}
      </HStack>

      <Box display="grid" gap={4}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height="260px" borderRadius="20px" />
        ))}
      </Box>
    </Box>
  );
}
