'use client';

import React from "react";
import Link from "next/link";
import { Text, Box, Image } from "@chakra-ui/react";

const NavbarBrand = () => (
  <Link href="/">
    <Box display="inline-flex" alignItems="center" gap="10px">
      <Image src="/logo_aoe.png" alt="AOE" h="34px" w="auto" />
      <Text
        as="span"
        display={{ base: "none", md: "inline" }}
        fontFamily="heading"
        fontSize="xl"
        letterSpacing="0.02em"
        color="aoe.text"
        textTransform="uppercase"
        lineHeight={1}
      >
        AOE<Text as="span" color="aoe.red">.</Text>
      </Text>
    </Box>
  </Link>
);

export default NavbarBrand;
