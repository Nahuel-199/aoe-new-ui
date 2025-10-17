'use client';

import React from "react";
import {
  Avatar,
  Box,
  Menu,
  Portal,
  defineStyle,
} from "@chakra-ui/react";
import { signOut } from "@/auth";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const NavbarUserMenu = ({ session }: { session: any }) => {
  const isAdmin =
    session?.user?.email === process.env.USER_ADMIN_EMAIL ||
    session?.user?.email === process.env.USER_ADMIN_EMAIL2;

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
            <Menu.Content>
              <Link href="/login">
                <Menu.Item value="login">Iniciar sesión</Menu.Item>
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
          </Avatar.Root>
        </Box>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="User email" disabled>{session.user.email}</Menu.Item>

            {isAdmin && (
              <>
                <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
                  <Menu.TriggerItem cursor="pointer">
                    Productos <LuChevronRight />
                  </Menu.TriggerItem>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Link href="/admin/products">
                          <Menu.Item value="lista de products">Lista</Menu.Item>
                        </Link>
                        <Link href="/admin/products/new">
                          <Menu.Item value="create product">Crear</Menu.Item>
                        </Link>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>

                <Link href="/admin/orders">
                  <Menu.Item value="pedidos">Pedidos</Menu.Item>
                </Link>
              </>
            )}

            <Menu.Item value="logout" onClick={() => signOut({ redirectTo: "/" })}>
              Cerrar sesión
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavbarUserMenu;
