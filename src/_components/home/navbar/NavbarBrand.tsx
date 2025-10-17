'use client';

import React from "react";
import Link from "next/link";
import { Text, Box } from "@chakra-ui/react";

const NavbarBrand = () => (
  <Link href="/">
    <Box display="inline-flex" alignItems="center">
      <Text
        as="span"
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="bold"
        color="red.500"
      >
        AOE
      </Text>

      <Text
        as="span"
        fontSize={{ base: "lg", md: "xl" }}
         fontWeight="bold"
        color="black"
        _dark={{ color: "black" }}
        display={{ base: "none", md: "inline" }}
        ml={1}
      >
        _INDUMENTARIA
      </Text>

      <Text
        as="span"
        fontSize={{ base: "lg", md: "xl" }}
         fontWeight="bold"
        color="black"
        _dark={{ color: "black" }}
        display={{ base: "inline", md: "none" }}
        ml={1}
      >
        _IND
      </Text>
    </Box>
  </Link>
);

export default NavbarBrand;
