"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function AdminHeader() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottomWidth="1px"
      bg="bg"
      shadow="sm"
    >
      <HStack justify="space-between" p={4}>
        <HStack gap={1}>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            AOE
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
            -
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="red.500"
          >
            INDUMENTARIA
          </Text>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            fontWeight="medium"
            color="gray.500"
            ml={4}
          >
            Admin Panel
          </Text>
        </HStack>
        <ColorModeButton />
      </HStack>
    </Box>
  );
}
