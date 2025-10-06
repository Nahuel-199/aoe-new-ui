"use client";

import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Portal,
  useBreakpointValue,
  VStack,
  Text,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { ColorModeButton } from "@/components/ui/color-mode";

const SidebarContent = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  return (
    <VStack ref={contentRef} align="stretch" p={4} gap={4}>
      <Box display={"flex"}>
        <Text>AOE</Text>
        <Text>-</Text>
        <Text color={"red.400"}>INDUMENTARIA</Text>
      </Box>
      <Button
        onClick={() => router.push("/")}
        variant="ghost"
        justifyContent="flex-start"
      >
        Home
      </Button>
      <Button
        onClick={() => router.push("/admin/products")}
        variant="ghost"
        justifyContent="flex-start"
      >
        Productos
      </Button>
      <Button
        onClick={() => router.push("/admin/categories")}
        variant="ghost"
        justifyContent="flex-start"
      >
        Categorías
      </Button>
      <Button
        onClick={() => router.push("/admin/subcategories")}
        variant="ghost"
        justifyContent="flex-start"
      >
        Subcategorias
      </Button>
      <Button
        onClick={() => router.push("/admin/orders")}
        variant="ghost"
        justifyContent="flex-start"
      >
        Ordenes de compra
      </Button>
      <HStack>
        <ColorModeButton
          _dark={{ color: "white", _hover: { bg: "gray.300" } }}
        />
      </HStack>
    </VStack>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -240, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="Abrir menú"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <FiMenu />
        </IconButton>
        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Menú</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <SidebarContent />
                </Drawer.Body>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </>
    );
  }

  return (
    <Box
      w="240px"
      h="100vh"
      borderRightWidth="1px"
      position="sticky"
      top={0}
      ref={sidebarRef}
    >
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
