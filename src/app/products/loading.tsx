import { Box, HStack, SimpleGrid, Skeleton } from "@chakra-ui/react";

export default function ProductsLoading() {
  return (
    <Box maxW="1360px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 9, md: "36px" }}>
      <Skeleton height="12px" width="140px" mb="14px" />
      <Skeleton height="40px" width="260px" mb="10px" />
      <Skeleton height="14px" width="200px" mb="26px" />

      <HStack gap={2} mb={6} overflow="hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="38px" width="100px" borderRadius="pill" flexShrink={0} />
        ))}
      </HStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="16px" mt={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i}>
            <Skeleton aspectRatio="4 / 5" borderRadius="16px" />
            <Skeleton height="14px" mt="12px" width="80%" />
            <Skeleton height="12px" mt="8px" width="50%" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
