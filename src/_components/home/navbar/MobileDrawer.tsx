import React from "react";
import {
  Drawer,
  Text,
  VStack,
  Button,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  session: any;
}

const linkProps = {
  variant: "ghost" as const,
  justifyContent: "flex-start" as const,
  w: "full",
  color: "aoe.textMuted",
  fontFamily: "mono",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  _hover: { color: "aoe.text", bg: "aoe.surface" },
};

const MobileDrawer = ({ open, onClose, session }: Props) => (
  <Drawer.Root
    open={open}
    onOpenChange={(e) => !e.open && onClose()}
    placement="end"
  >
    <Drawer.Backdrop bg="rgba(0,0,0,0.65)" />
    <Drawer.Positioner>
      <Drawer.Content
        h="100dvh"
        w={{ base: "80%", sm: "70%", md: "50%" }}
        borderRightRadius="xl"
        overflowY="auto"
        bg="aoe.bgAlt"
        color="aoe.text"
      >
        <Drawer.Header borderBottomWidth="1px" borderColor="aoe.borderSubtle">
          <Text fontFamily="heading" fontSize="2xl" textTransform="uppercase">
            Menú
          </Text>
        </Drawer.Header>

        <Drawer.Body>
          <VStack gap={2} align="stretch" pt={2}>
            <Link href="/products" onClick={onClose}>
              <Button {...linkProps}>Todo</Button>
            </Link>
            <Link href="/products?category=Remeras" onClick={onClose}>
              <Button {...linkProps}>Remeras</Button>
            </Link>
            <Link href="/products?category=Buzos" onClick={onClose}>
              <Button {...linkProps}>Buzos</Button>
            </Link>
            <Link href="/products?category=Ofertas" onClick={onClose}>
              <Button {...linkProps} color="aoe.red">Ofertas</Button>
            </Link>
            <Link href="/personalizados" onClick={onClose}>
              <Button {...linkProps}>Personalizados</Button>
            </Link>

            {session?.user?.email && (
              <Link href="/mis-pedidos" onClick={onClose}>
                <Button {...linkProps}>Mis pedidos</Button>
              </Link>
            )}
          </VStack>
        </Drawer.Body>

        <Drawer.Footer borderTopWidth="1px" borderColor="aoe.borderSubtle">
          <Box w="full" textAlign="center">
            <Text fontFamily="mono" fontSize="10px" color="aoe.textGhost" letterSpacing="0.08em">
              © 2026 AOE INDUMENTARIA
            </Text>
          </Box>
        </Drawer.Footer>

        <Drawer.CloseTrigger asChild>
          <CloseButton size="sm" position="absolute" top={3} right={3} color="aoe.textFaint" />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
);

export default MobileDrawer;
