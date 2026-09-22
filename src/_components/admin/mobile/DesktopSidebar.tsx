"use client";

import { Box, Text } from "@chakra-ui/react";
import { ADMIN_TABS, AdminTab } from "@/lib/constants/adminNav";

interface DesktopSidebarProps {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export default function DesktopSidebar({ active, onChange }: DesktopSidebarProps) {
  return (
    <Box
      as="nav"
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      w="220px"
      zIndex={45}
      bg="aoe.bgAlt"
      borderRight="1px solid"
      borderColor="aoe.borderSubtle"
      pt="90px"
      pb="20px"
      px="14px"
      display="flex"
      flexDirection="column"
      gap="6px"
    >
      {ADMIN_TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <Box
            key={t.key}
            as="button"
            onClick={() => onChange(t.key)}
            display="flex"
            alignItems="center"
            gap="12px"
            h="46px"
            px="14px"
            borderRadius="12px"
            border="none"
            bg={isActive ? "aoe.surface" : "transparent"}
            color={isActive ? "aoe.red" : "aoe.textMuted"}
            fontSize="14px"
            fontWeight="700"
            textAlign="left"
            cursor="pointer"
            _hover={{ bg: isActive ? "aoe.surface" : "aoe.chip" }}
          >
            <Text fontSize="16px" w="20px" textAlign="center" flexShrink={0}>
              {t.icon}
            </Text>
            <Text fontFamily="mono" fontSize="12px" letterSpacing="0.06em" textTransform="uppercase">
              {t.label}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
