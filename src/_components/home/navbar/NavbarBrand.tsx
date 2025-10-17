'use client';

import React from "react";
import Link from "next/link";
import { Text } from "@chakra-ui/react";

const NavbarBrand = () => (
  <Link href="/">
    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="red.500">
      AOE
      <Text
        as="span"
        fontSize={{ base: "lg", md: "xl" }}
        color="black"
        _dark={{ color: "black" }}
      >
        _INDUMENTARIA
      </Text>
    </Text>
  </Link>
);

export default NavbarBrand;
