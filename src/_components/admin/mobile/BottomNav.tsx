"use client";

import { Box, Grid, Text } from "@chakra-ui/react";
import { ADMIN_TABS, AdminTab } from "@/lib/constants/adminNav";

interface BottomNavProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      right={0}
      bottom={0}
      zIndex={70}
      bg="rgba(10,10,10,0.96)"
      backdropFilter="blur(14px)"
      borderTop="1px solid"
      borderColor="aoe.borderSubtle"
    >
      <Grid
        maxW="760px"
        mx="auto"
        px="10px"
        pt="8px"
        pb="14px"
        templateColumns="repeat(5, 1fr)"
        gap="4px"
        alignItems="end"
      >
        {ADMIN_TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <Box
              key={t.key}
              as="button"
              onClick={() => onChange(t.key)}
              bg={isActive ? "aoe.surface" : "transparent"}
              border="none"
              borderRadius="14px"
              py="9px"
              px="4px"
              display="grid"
              gap="5px"
              justifyItems="center"
              color={isActive ? "aoe.red" : "aoe.textMuted"}
              cursor="pointer"
            >
              <Text fontSize="17px" lineHeight="1">
                {t.icon}
              </Text>
              <Text fontFamily="mono" fontSize="11px" letterSpacing="0.06em" textTransform="uppercase">
                {t.label}
              </Text>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
