'use client';

import React from "react";
import {
  Avatar,
  Box,
  Menu,
  Portal,
  defineStyle,
} from "@chakra-ui/react";
import Link from "next/link";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const NavbarUserMenu = ({ session, isAdmin }: { session: any, isAdmin: boolean }) => {

  const menuContentProps = {
    bg: "aoe.bgAlt",
    borderColor: "aoe.borderSubtle",
    borderWidth: "1px",
    color: "aoe.text",
  };

  if (!session?.user?.email) {
    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <Box cursor="pointer">
            <Avatar.Root css={ringCss} colorPalette="red" boxSize="35px">
              <Avatar.Fallback name="Usuario" />
            </Avatar.Root>
          </Box>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content {...menuContentProps}>
              <Link href="/login">
                <Menu.Item value="login" _hover={{ bg: "aoe.surface" }}>Iniciar sesión</Menu.Item>
              </Link>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Box cursor="pointer">
          <Avatar.Root css={ringCss} colorPalette="red" boxSize="35px">
            <Avatar.Fallback name={session.user.email} />
            <Avatar.Image src={session.user.image} />
          </Avatar.Root>
        </Box>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content {...menuContentProps}>
            <Menu.Item value="User email" disabled color="aoe.textFaint">{session.user.email}</Menu.Item>

            {isAdmin && (
              <Link href="/admin">
                <Menu.Item value="admin-panel" cursor="pointer" _hover={{ bg: "aoe.surface" }}>
                  Panel de Administrador
                </Menu.Item>
              </Link>
            )}
            <Menu.Item
              value="logout"
              _hover={{ bg: "aoe.surface" }}
              onClick={() => window.location.href = "/api/auth/signout?callbackUrl=/"}
            >
              Cerrar sesión
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavbarUserMenu;
