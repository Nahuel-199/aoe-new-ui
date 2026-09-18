"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, HStack } from "@chakra-ui/react";
import { NAV_LINKS, isNavLinkActive } from "@/lib/constants/navLinks";

const NavbarLinks = ({ session }: { session: any }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <HStack gap="26px">
      {NAV_LINKS.filter((link) => !link.requiresAuth || session?.user?.email).map(
        (link) => {
          const active = isNavLinkActive(link, pathname, category);
          return (
            <Link key={link.label} href={link.href}>
              <Button
                variant="ghost"
                color={active ? "aoe.text" : "aoe.textMuted"}
                fontFamily="mono"
                fontSize="13px"
                fontWeight="700"
                letterSpacing="0.1em"
                textTransform="uppercase"
                px={0}
                h="auto"
                py="2px"
                borderRadius={0}
                border="none"
                borderBottomWidth="2px"
                borderBottomStyle="solid"
                borderBottomColor={active ? "aoe.red" : "transparent"}
                _hover={{ color: "aoe.text", bg: "transparent" }}
              >
                {link.label}
              </Button>
            </Link>
          );
        }
      )}
    </HStack>
  );
};

export default NavbarLinks;
