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
import { LuChevronRight } from "react-icons/lu";

const ringCss = defineStyle({
  outlineWidth: "2px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "solid",
});

const NavbarUserMenu = ({ session, isAdmin }: { session: any, isAdmin: boolean }) => {

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
              <Menu.Root positioning={{ placement: "left", gutter: 2 }}>
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
              <Menu.Root
                positioning={{ placement: "right-start", gutter: 2 }}
              >
                <Menu.TriggerItem cursor={"pointer"}>
                  Categorias <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Link href={"/admin/categories"}>
                        <Menu.Item
                          value="list-categories"
                          cursor={"pointer"}
                        >
                          Lista
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                    <Menu.Content>
                      <Link href={"/admin/categories/new"}>
                        <Menu.Item
                          value="create-categories"
                          cursor={"pointer"}
                        >
                          Crear
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <Menu.Root
                positioning={{ placement: "right-start", gutter: 2 }}
              >
                <Menu.TriggerItem cursor={"pointer"}>
                  Sub-Categorias <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Link href={"/admin/subcategories"}>
                        <Menu.Item
                          value="list-subcategories"
                          cursor={"pointer"}
                        >
                          Lista
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                    <Menu.Content>
                      <Link href={"/admin/subcategories/new"}>
                        <Menu.Item
                          value="create-subcategories"
                          cursor={"pointer"}
                        >
                          Crear
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
               <Menu.Root
                positioning={{ placement: "right-start", gutter: 2 }}
              >
                <Menu.TriggerItem cursor={"pointer"}>
                  Personalizados <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Link href={"/admin/custom-orders"}>
                        <Menu.Item
                          value="list-custom-orders"
                          cursor={"pointer"}
                        >
                          Lista
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                    <Menu.Content>
                      <Link href={"/admin/custom-orders/new"}>
                        <Menu.Item
                          value="create-custom-orders"
                          cursor={"pointer"}
                        >
                          Crear
                        </Menu.Item>
                      </Link>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <Link href="/admin/orders">
                <Menu.Item value="pedidos" cursor={"pointer"}>
                  Pedidos
                  </Menu.Item>
              </Link>
            </>

            )}
            <Menu.Item value="logout" onClick={() => window.location.href = "/api/auth/signout?callbackUrl=/"}>
              Cerrar sesión
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavbarUserMenu;
