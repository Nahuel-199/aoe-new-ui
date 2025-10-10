"use client";

import React, { useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  VStack,
  Avatar,
  defineStyle,
  Menu,
  Portal,
  Drawer,
  CloseButton,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { FaBars } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { LuChevronRight } from "react-icons/lu";
import { useSession } from "next-auth/react";
import SkeletonNav from "./SkeletonNav";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { cart } = useCart();

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  });

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  if (status === "loading") {
    return <SkeletonNav />;
  }

  return (
    <Box
      ref={navbarRef}
      as="nav"
      position="sticky"
      top="10px"
      mb={4}
      zIndex={10}
      bg="white"
      _dark={{ bg: "white.800" }}
      boxShadow="lg"
      borderRadius="lg"
      px={4}
      py={2}
      mx="auto"
      width={{ base: "85%", md: "100%" }}
      maxW={{ base: "container.xl", md: "fit-content" }}
      overflowX="hidden"
    >
      <Flex align="center" justify="space-between" w="100%">
        <Flex align="center" gap={2}>
          <IconButton
            aria-label="Open Menu"
            display={{ base: "block", md: "none" }}
            onClick={() => setOpen(true)}
            variant="ghost"
            _dark={{ color: "black", _hover: { bg: "gray.300" } }}
          >
            <FaBars style={{ marginLeft: "10px" }} />
          </IconButton>
          <Text
            fontSize={{ base: "15px", md: "xl" }}
            fontWeight="bold"
            color="red.500"
          >
            <Link href="/">
              AOE
              <Text
                as="span"
                display={{ base: "inline", md: "inline" }}
                fontSize={{ base: "15px", md: "xl" }}
                color={"black"}
                _dark={{ color: "black" }}
              >
                _INDUMENTARIA
              </Text>
            </Link>
          </Text>
        </Flex>
        <HStack display={{ base: "none", md: "flex" }} ml={4}>
          <Link href="/products">
            <Button
              variant="ghost"
              _dark={{ color: "black", _hover: { bg: "gray.300" } }}
            >
              Productos
            </Button>
          </Link>
          {session?.user?.email && (
            <Link href="/mis-pedidos">
              <Button
                variant="ghost"
                _dark={{ color: "black", _hover: { bg: "gray.300" } }}
              >
                Mis pedidos
              </Button>
            </Link>
          )}
        </HStack>
        <Flex align="center" gap={4}>
          <Box position="relative">
            <Link href="/cart">
              <IconButton
                aria-label="Cart"
                variant="ghost"
                _dark={{
                  color: "blackAlpha.900",
                  _hover: { bg: "gray.300" },
                }}
              >
                <FiShoppingCart />
              </IconButton>
            </Link>
            {cart.length > 0 && (
              <Badge
                colorPalette="red"
                borderRadius="full"
                position="absolute"
                top={0}
                right={-2}
                fontSize="0.7em"
                px={2}
              >
                {cart.length}
              </Badge>
            )}
          </Box>
          <ColorModeButton
            _dark={{ color: "black", _hover: { bg: "gray.300" } }}
          />
          {session?.user?.email ? (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Box cursor="pointer">
                  <Avatar.Root
                    css={ringCss}
                    colorPalette="red"
                    boxSize={{ base: "30px", md: "40px" }}
                    flexShrink={0}
                  >
                    <Avatar.Fallback name={session?.user?.email || "Usuario"} />
                  </Avatar.Root>
                </Box>
              </Menu.Trigger>

              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value={"session.email"} disabled>
                      {session?.user?.email || "Usuario"}
                    </Menu.Item>
                    {session?.user?.email === process.env.USER_ADMIN_EMAIL ||
                      process.env.USER_ADMIN_EMAIL2}
                    <Menu.Root
                      positioning={{ placement: "right-start", gutter: 2 }}
                    >
                      <Menu.TriggerItem cursor={"pointer"}>
                        Productos <LuChevronRight />
                      </Menu.TriggerItem>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Link href={"/admin/products"}>
                              <Menu.Item
                                value="list-product"
                                cursor={"pointer"}
                              >
                                Lista
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                          <Menu.Content>
                            <Link href={"/admin/products/new"}>
                              <Menu.Item
                                value="create-product"
                                cursor={"pointer"}
                              >
                                Crear
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    <Menu.Root
                      positioning={{ placement: "right-start", gutter: 2 }}
                    >
                      <Menu.TriggerItem cursor={"pointer"}>
                        Categorias <LuChevronRight />
                      </Menu.TriggerItem>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Link href={"/admin/categories"}>
                              <Menu.Item
                                value="list-categories"
                                cursor={"pointer"}
                              >
                                Lista
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                          <Menu.Content>
                            <Link href={"/admin/categories/create"}>
                              <Menu.Item
                                value="create-categories"
                                cursor={"pointer"}
                              >
                                Crear
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    <Menu.Root
                      positioning={{ placement: "right-start", gutter: 2 }}
                    >
                      <Menu.TriggerItem cursor={"pointer"}>
                        Sub-Categorias <LuChevronRight />
                      </Menu.TriggerItem>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Link href={"/admin/subcategories"}>
                              <Menu.Item
                                value="list-subcategories"
                                cursor={"pointer"}
                              >
                                Lista
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                          <Menu.Content>
                            <Link href={"/admin/subcategories/create"}>
                              <Menu.Item
                                value="create-subcategories"
                                cursor={"pointer"}
                              >
                                Crear
                              </Menu.Item>
                            </Link>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    <Link href={"/admin/orders"}>
                      <Menu.Item value={"pedidos"} cursor={"pointer"}>
                        Pedidos
                      </Menu.Item>
                    </Link>
                    <Menu.Item value="logout" cursor={"pointer"}>
                      <Box
                        as="button"
                        onClick={() =>
                          (window.location.href = "/api/auth/logout")
                        }
                      >
                        Cerrar sesión
                      </Box>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Box cursor="pointer">
                  <Avatar.Root
                    css={ringCss}
                    colorPalette="red"
                    w={{ base: "30px", md: "40px" }}
                    h={{ base: "30px", md: "40px" }}
                  >
                    <Avatar.Fallback name="Usuario" />
                  </Avatar.Root>
                </Box>
              </Menu.Trigger>

              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Link href={"/login"}>
                      <Menu.Item value="Iniciar Sesión">
                        <Box>Iniciar sesión</Box>
                      </Menu.Item>
                    </Link>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </Flex>
      </Flex>

      <Drawer.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement={"end"}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Text fontSize="lg">Menu</Text>
            </Drawer.Header>
            <Drawer.Body>
              <VStack>
                <Link href="/products" style={{ width: "100%" }} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    width="full"
                    _dark={{
                      color: "black",
                      bg: "white",
                      _hover: { bg: "gray.300" },
                    }}
                  >
                    Productos
                  </Button>
                </Link>
                <Link href="/mis-pedidos" style={{ width: "100%" }} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    width="full"
                    _dark={{
                      color: "black",
                      bg: "white",
                      _hover: { bg: "gray.300" },
                    }}
                  >
                    Mis pedidos
                  </Button>
                </Link>
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Text fontSize="sm">&copy; 2025 AOE INDUMENTARIA</Text>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </Box>
  );
};

export default Navbar;
