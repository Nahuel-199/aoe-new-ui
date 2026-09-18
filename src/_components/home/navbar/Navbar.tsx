"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Badge,
  SkeletonCircle,
  Input,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { FiShoppingCart, FiSearch, FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

import NavbarUserMenu from "./NavbarUserMenu";
import NavbarBrand from "./NavbarBrand";
import NavbarLinks from "./NavbarLinks";
import MobileDrawer from "./MobileDrawer";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: session, status } = useSession();
  const { cart, openCart } = useCart();
  const router = useRouter();
  const isAdmin = session?.user?.role === "admin";
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  const submitSearch = () => {
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <Box
      ref={navbarRef}
      as="nav"
      position="sticky"
      top={0}
      zIndex={60}
      bg="rgba(10,10,10,0.92)"
      backdropFilter="blur(14px)"
      borderBottom="1px solid"
      borderColor="aoe.borderSubtle"
    >
      <Box maxW="1360px" mx="auto" px={{ base: 3, md: 5 }} py="14px">
        <Flex align="center" gap={{ base: 3, md: 6 }}>
          <Flex align="center" gap={2}>
            <IconButton
              aria-label="Open Menu"
              display={{ base: "flex", md: "none" }}
              onClick={() => setOpen(true)}
              variant="ghost"
              color="aoe.text"
              _hover={{ bg: "aoe.surface" }}
            >
              <FaBars />
            </IconButton>

            <NavbarBrand />
          </Flex>

          <HStack display={{ base: "none", md: "flex" }} flex={1} ml={2}>
            <Suspense fallback={<HStack gap="26px" />}>
              <NavbarLinks session={session} />
            </Suspense>
          </HStack>

          <Flex align="center" gap={{ base: 2, md: 3 }} ml={{ base: "auto", md: 0 }}>
            <IconButton
              aria-label="Buscar"
              onClick={() => setSearchOpen((v) => !v)}
              borderRadius="pill"
              variant="outline"
              borderColor="aoe.borderControl"
              bg="aoe.chip"
              color="aoe.text"
              _hover={{ borderColor: "aoe.red" }}
            >
              {searchOpen ? <FiX /> : <FiSearch />}
            </IconButton>

            <Box position="relative">
              <Box
                as="button"
                onClick={openCart}
                h="40px"
                px="16px"
                borderRadius="pill"
                border="none"
                bg="aoe.text"
                color="aoe.bg"
                display="flex"
                alignItems="center"
                gap="8px"
                fontFamily="mono"
                fontSize="12px"
                fontWeight="800"
                letterSpacing="0.08em"
                textTransform="uppercase"
                cursor="pointer"
                _hover={{ bg: "aoe.red", color: "white" }}
              >
                Carrito
                <Box
                  minW="20px"
                  h="20px"
                  px="5px"
                  borderRadius="pill"
                  bg="aoe.red"
                  color="white"
                  display="grid"
                  placeItems="center"
                  fontFamily="mono"
                  fontSize="11px"
                >
                  {cartCount}
                </Box>
              </Box>
            </Box>

            {session?.user?.id && <NotificationBell userId={session.user.id} />}

            {status === "loading" ? (
              <SkeletonCircle size="10" />
            ) : (
              <NavbarUserMenu session={session} isAdmin={isAdmin} />
            )}
          </Flex>
        </Flex>
      </Box>

      {searchOpen && (
        <Box borderTop="1px solid" borderColor="aoe.borderSubtle" bg="aoe.bgAlt">
          <Flex maxW="1360px" mx="auto" px={{ base: 3, md: 5 }} py="16px" align="center" gap={3}>
            <Box fontFamily="mono" fontSize="11px" color="aoe.textFaint" letterSpacing="0.12em">
              BUSCAR
            </Box>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Stranger Things, Naruto, oversize…"
              flex={1}
              bg="transparent"
              border="none"
              borderBottom="1px solid"
              borderColor="aoe.borderControl"
              borderRadius={0}
              color="aoe.text"
              fontSize="lg"
              px="2px"
              _focusVisible={{ outline: "none", borderColor: "aoe.red" }}
              autoFocus
            />
            <Box
              as="button"
              onClick={() => setSearchOpen(false)}
              fontFamily="mono"
              fontSize="11px"
              color="aoe.textFaint"
              letterSpacing="0.12em"
              cursor="pointer"
              bg="transparent"
              border="none"
            >
              CERRAR ✕
            </Box>
          </Flex>
        </Box>
      )}

      <Suspense fallback={null}>
        <MobileDrawer open={open} onClose={() => setOpen(false)} session={session} />
      </Suspense>
    </Box>
  );
};

export default Navbar;
