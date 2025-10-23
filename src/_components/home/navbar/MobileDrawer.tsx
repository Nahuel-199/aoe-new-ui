import React from "react";
import {
  Drawer,
  Text,
  VStack,
  Button,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  session: any;
}

const MobileDrawer = ({ open, onClose, session }: Props) => (
  <Drawer.Root
    open={open}
    onOpenChange={(e) => !e.open && onClose()}
    placement="end"
  >
    <Drawer.Backdrop />
    <Drawer.Positioner>
      <Drawer.Content
        h="100dvh"
        w={{ base: "80%", sm: "70%", md: "50%" }}
        borderRightRadius="xl"
        overflowY="auto"
      >
        <Drawer.Header borderBottomWidth="1px">
          <Text fontSize="lg" fontWeight="bold">
            Menú
          </Text>
        </Drawer.Header>

        <Drawer.Body>
          <VStack gap={3} align="stretch">
            <Link href="/products" onClick={onClose}>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                textAlign={"center"}
                w="full"
                _dark={{ color: "black", bg: "white", _hover: { bg: "gray.300" } }}
              >
                Productos
              </Button>
            </Link>

             <Link href="/personalizados" onClick={onClose}>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                textAlign={"center"}
                w="full"
                _dark={{ color: "black", bg: "white", _hover: { bg: "gray.300" } }}
              >
                Personalizados
              </Button>
            </Link>

            {session?.user?.email && (
              <Link href="/mis-pedidos" onClick={onClose}>
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  textAlign={"center"}
                  w="full"
                  _dark={{ color: "black", bg: "white", _hover: { bg: "gray.300" } }}
                >
                  Mis pedidos
                </Button>
              </Link>
            )}
          </VStack>
        </Drawer.Body>

        <Drawer.Footer borderTopWidth="1px">
          <Box w="full" textAlign="center">
            <Text fontSize="sm" color="gray.500">
              &copy; 2025 AOE INDUMENTARIA
            </Text>
          </Box>
        </Drawer.Footer>

        <Drawer.CloseTrigger asChild>
          <CloseButton size="sm" position="absolute" top={3} right={3} />
        </Drawer.CloseTrigger>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
);

export default MobileDrawer;
