'use client';

import React from "react";
import Link from "next/link";
import { Button, HStack } from "@chakra-ui/react";

const linkProps = {
  variant: "ghost" as const,
  color: "aoe.textMuted",
  fontFamily: "mono",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  px: 0,
  _hover: { color: "aoe.text", bg: "transparent" },
};

const NavbarLinks = ({ session }: { session: any }) => (
  <HStack gap="26px">
    <Link href="/products">
      <Button {...linkProps} color="aoe.text">
        Todo
      </Button>
    </Link>
    <Link href="/products?category=Remeras">
      <Button {...linkProps}>Remeras</Button>
    </Link>
    <Link href="/products?category=Buzos">
      <Button {...linkProps}>Buzos</Button>
    </Link>
    <Link href="/products?category=Ofertas">
      <Button {...linkProps} color="aoe.red" _hover={{ color: "aoe.red", bg: "transparent" }}>
        Ofertas
      </Button>
    </Link>
    <Link href="/personalizados">
      <Button {...linkProps}>Personalizados</Button>
    </Link>
    {session?.user?.email && (
      <Link href="/mis-pedidos">
        <Button {...linkProps}>Mis pedidos</Button>
      </Link>
    )}
  </HStack>
);

export default NavbarLinks;
