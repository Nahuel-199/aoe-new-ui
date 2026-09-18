import { Container, Grid, Skeleton, VStack } from "@chakra-ui/react";

export default function ProductDetailsLoading() {
  return (
    <Container maxW="1360px" py={{ base: 7, md: "28px" }}>
      <Skeleton height="16px" width="140px" mb={5} />

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
        <Skeleton aspectRatio="4 / 5" borderRadius="16px" />
        <VStack align="stretch" gap={4}>
          <Skeleton height="14px" width="30%" />
          <Skeleton height="32px" width="70%" />
          <Skeleton height="24px" width="40%" />
          <Skeleton height="16px" width="90%" />
          <Skeleton height="16px" width="60%" />
          <Skeleton height="48px" width="100%" borderRadius="pill" mt={4} />
        </VStack>
      </Grid>
    </Container>
  );
}
