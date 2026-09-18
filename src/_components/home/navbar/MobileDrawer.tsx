"use client";

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
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_LINKS, isNavLinkActive } from "@/lib/constants/navLinks";

interface Props {
  open: boolean;
  onClose: () => void;
  session: any;
}

const MobileDrawer = ({ open, onClose, session }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
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
              {NAV_LINKS.filter(
                (link) => !link.requiresAuth || session?.user?.email
              ).map((link) => {
                const active = isNavLinkActive(link, pathname, category);
                return (
                  <Link key={link.label} href={link.href} onClick={onClose}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      w="full"
                      color={active ? "aoe.text" : "aoe.textMuted"}
                      fontFamily="mono"
                      fontSize="13px"
                      fontWeight="700"
                      letterSpacing="0.08em"
                      textTransform="uppercase"
                      borderLeft="3px solid"
                      borderColor={active ? "aoe.red" : "transparent"}
                      bg={active ? "aoe.surface" : "transparent"}
                      _hover={{ color: "aoe.text", bg: "aoe.surface" }}
                    >
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
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
};

export default MobileDrawer;
