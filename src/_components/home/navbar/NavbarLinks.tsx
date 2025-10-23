'use client';

import React from "react";
import Link from "next/link";
import { Button, HStack } from "@chakra-ui/react";

const NavbarLinks = ({ session }: { session: any }) => (
  <HStack gap={3}>
    <Link href="/products">
      <Button variant="ghost" ml={4} _dark={{ color: "black", _hover: { bg: "gray.300" } }}>
        Productos
      </Button>
    </Link>
    <Link href="/personalizados">
      <Button variant="ghost" ml={4} _dark={{ color: "black", _hover: { bg: "gray.300" } }}>
        Personalizados
      </Button>
    </Link>
    {session?.user?.email && (
      <Link href="/mis-pedidos">
        <Button variant="ghost" _dark={{ color: "black", _hover: { bg: "gray.300" } }}>
          Mis pedidos
        </Button>
      </Link>
    )}
  </HStack>
);

export default NavbarLinks;
