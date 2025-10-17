"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Box, Flex, HStack, IconButton, Badge } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ColorModeButton } from "@/components/ui/color-mode";

import NavbarBrand from "./NavbarBrand";
import NavbarLinks from "./NavbarLinks";
import NavbarUserMenu from "./NavbarUserMenu";
import MobileDrawer from "./MobileDrawer";
import SkeletonNav from "./SkeletonNav";

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { cart } = useCart();

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  if (status === "loading") return <SkeletonNav />;

  return (
    <Box
      ref={navbarRef}
      as="nav"
      position="sticky"
      top="10px"
      zIndex={10}
      bg="white"
      _dark={{ bg: "white.800" }}
      boxShadow="lg"
      borderRadius="lg"
      px={{ base: 3, md: 6 }}
      py={2}
      mx="auto"
      mb={4}
      width={{ base: "95%", md: "100%" }}
      maxW={{ base: "container.xl", md: "fit-content" }}
    >
      <Flex align="center" justify="space-between" w="100%">
        <Flex align="center" gap={2}>
          <IconButton
            aria-label="Open Menu"
            display={{ base: "flex", md: "none" }}
            onClick={() => setOpen(true)}
            variant="ghost"
            _dark={{ color: "black", _hover: { bg: "gray.300" } }}
          >
            <FaBars />
          </IconButton>

          <NavbarBrand />
        </Flex>

        <HStack display={{ base: "none", md: "flex" }} gap={3}>
          <NavbarLinks session={session} />
        </HStack>

        <Flex align="center" gap={{ base: 2, md: 4 }}>
          <Box position="relative">
            <Link href="/cart">
              <IconButton
                aria-label="Cart"
                variant="ghost"
                _dark={{ color: "blackAlpha.900", _hover: { bg: "gray.300" } }}
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

          <NavbarUserMenu session={session} />
        </Flex>
      </Flex>

        <MobileDrawer
          open={open}
          onClose={() => setOpen(false)}
          session={session}
        />

    </Box>
  );
};

export default Navbar;
