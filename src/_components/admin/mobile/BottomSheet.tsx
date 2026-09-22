"use client";

import { Box, Text } from "@chakra-ui/react";

export interface SheetAction {
  label: string;
  color?: string;
  onClick: () => void;
}

export interface SheetConfig {
  title: string;
  subtitle?: string;
  actions: SheetAction[];
}

interface BottomSheetProps {
  sheet: SheetConfig | null;
  onClose: () => void;
  isDesktop?: boolean;
}

/**
 * Cada acción es responsable de cerrar (o encadenar otro sheet) llamando a
 * `onClose`/al setter de estado ella misma — así se pueden armar flujos de
 * confirmación (ej: "Eliminar" abre un segundo sheet de confirmación).
 *
 * En desktop se muestra como modal centrado en vez de hoja deslizada desde
 * abajo — el patrón "bottom sheet" es mobile-nativo y no tiene sentido con
 * más espacio de pantalla disponible.
 */
export default function BottomSheet({ sheet, onClose, isDesktop = false }: BottomSheetProps) {
  if (!sheet) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={90}
      display="flex"
      alignItems={isDesktop ? "center" : "flex-end"}
      justifyContent={isDesktop ? "center" : undefined}
    >
      <Box
        as="button"
        aria-label="Cerrar"
        position="absolute"
        inset={0}
        bg="rgba(0,0,0,0.7)"
        border="none"
        onClick={onClose}
      />
      <Box
        position="relative"
        w="full"
        maxW={isDesktop ? "440px" : "760px"}
        mx={isDesktop ? 4 : "auto"}
        bg="aoe.tile"
        border={isDesktop ? "1px solid" : undefined}
        borderColor={isDesktop ? "aoe.borderControl" : undefined}
        borderTop={isDesktop ? undefined : "1px solid"}
        borderTopColor={isDesktop ? undefined : "aoe.borderControl"}
        borderRadius={isDesktop ? "22px" : undefined}
        borderTopRadius={isDesktop ? undefined : "22px"}
        px={4}
        pt="10px"
        pb="22px"
      >
        {!isDesktop && (
          <Box w="44px" h="4px" borderRadius="pill" bg="aoe.borderHover" mx="auto" mb="16px" mt="6px" />
        )}
        <Text fontSize="16px" fontWeight="700" mb="4px" color="aoe.text">
          {sheet.title}
        </Text>
        {sheet.subtitle && (
          <Text
            fontFamily="mono"
            fontSize="11px"
            color="aoe.textMuted"
            letterSpacing="0.08em"
            textTransform="uppercase"
            mb="16px"
          >
            {sheet.subtitle}
          </Text>
        )}
        <Box display="grid" gap="8px">
          {sheet.actions.map((a, i) => (
            <Box
              key={i}
              as="button"
              onClick={a.onClick}
              h="54px"
              borderRadius="14px"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg="aoe.chip"
              color={a.color || "aoe.text"}
              fontSize="14px"
              fontWeight="700"
              textAlign="left"
              px={4}
            >
              {a.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
