"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface AdminHeaderMobileProps {
  title: string;
  subtitle: string;
  hasAlerts: boolean;
  onOpenAlerts: () => void;
  onBack?: () => void;
}

export default function AdminHeaderMobile({
  title,
  subtitle,
  hasAlerts,
  onOpenAlerts,
  onBack,
}: AdminHeaderMobileProps) {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="rgba(10,10,10,0.94)"
      backdropFilter="blur(14px)"
      borderBottom="1px solid"
      borderColor="aoe.borderSubtle"
    >
      <Flex maxW="760px" mx="auto" px={4} py="14px" align="center" gap={3}>
        {onBack ? (
          <Box
            as="button"
            aria-label="Volver"
            onClick={onBack}
            w="38px"
            h="38px"
            borderRadius="11px"
            border="1px solid"
            borderColor="aoe.borderControl"
            bg="aoe.chip"
            color="aoe.text"
            fontSize="16px"
            flexShrink={0}
          >
            ←
          </Box>
        ) : (
          <Box
            w="38px"
            h="38px"
            borderRadius="11px"
            bg="aoe.red"
            display="grid"
            placeItems="center"
            fontFamily="heading"
            fontSize="17px"
            color="white"
            flexShrink={0}
          >
            A
          </Box>
        )}
        <Box minW={0} flex={1}>
          <Text fontFamily="heading" fontSize="17px" textTransform="uppercase" lineHeight="1.05" color="aoe.text">
            {title}
          </Text>
          <Text
            fontFamily="mono"
            fontSize="11px"
            color="aoe.textMuted"
            letterSpacing="0.12em"
            textTransform="uppercase"
            mt="3px"
          >
            {subtitle}
          </Text>
        </Box>
        {!onBack && (
          <Box
            as="button"
            aria-label="Alertas"
            onClick={onOpenAlerts}
            w="42px"
            h="42px"
            borderRadius="12px"
            border="1px solid"
            borderColor="aoe.borderControl"
            bg="aoe.chip"
            color="aoe.text"
            fontSize="15px"
            position="relative"
            flexShrink={0}
          >
            ◔
            {hasAlerts && (
              <Box
                position="absolute"
                top="8px"
                right="9px"
                w="8px"
                h="8px"
                borderRadius="pill"
                bg="aoe.red"
                border="2px solid"
                borderColor="aoe.chip"
              />
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
