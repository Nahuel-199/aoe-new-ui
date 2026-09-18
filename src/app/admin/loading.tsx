import { Box, Grid, Skeleton } from "@chakra-ui/react";

export default function AdminLoading() {
  return (
    <Box bg="aoe.bg" minH="100vh" pb="104px">
      <Box maxW="760px" mx="auto" px={4} py="14px">
        <Skeleton height="38px" width="120px" borderRadius="14px" />
      </Box>

      <Box maxW="760px" mx="auto" px={4} pt="18px">
        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap="10px">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="96px" borderRadius="16px" />
          ))}
        </Grid>

        <Box display="grid" gap="10px" mt="26px">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="80px" borderRadius="16px" />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
