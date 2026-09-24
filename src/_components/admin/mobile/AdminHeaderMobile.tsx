"use client";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FaRegBell } from "react-icons/fa";

interface AdminHeaderMobileProps {
  title: string;
  subtitle: string;
  hasAlerts: boolean;
  onOpenAlerts: () => void;
  onBack?: () => void;
  onLogoClick?: () => void;
  maxW?: string;
  isDesktop?: boolean;
}

export default function AdminHeaderMobile({
  title,
  subtitle,
  hasAlerts,
  onOpenAlerts,
  onBack,
  onLogoClick,
  maxW = "760px",
  isDesktop = false,
}: AdminHeaderMobileProps) {
  // En desktop el header va de punta a punta con un gutter fijo, en vez de
  // centrarse/offsetearse junto con el contenido: así el logo queda siempre
  // pegado al borde real de la pantalla, no "flotando" alineado con el
  // arranque de la columna de contenido (que está corrida por el sidebar).
  const containerProps = isDesktop
    ? { w: "full" as const, pl: "24px", pr: "24px" }
    : { maxW, mx: "auto" as const, px: 4 };

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
      <Flex {...containerProps} py="14px" align="center" gap={3}>
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
            as="button"
            aria-label="Ir al inicio del sitio"
            onClick={onLogoClick}
            boxSize="38px"
            borderRadius="11px"
            flexShrink={0}
            overflow="hidden"
          >
            <Image src="/logo_aoe-small.webp" alt="AOE" boxSize="38px" objectFit="contain" />
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
            fontSize="16px"
            display="grid"
            placeItems="center"
            position="relative"
            flexShrink={0}
          >
            <FaRegBell />
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
