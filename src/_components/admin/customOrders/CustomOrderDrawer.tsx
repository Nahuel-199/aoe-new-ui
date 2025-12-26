"use client";

import { Drawer, IconButton, HStack } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import CustomOrderForm from "./CustomOrderForm";
import { useRouter } from "next/navigation";

interface CustomOrderDrawerProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  orderId?: string;
}

export default function CustomOrderDrawer({
  open,
  onClose,
  mode = "create",
  orderId,
}: CustomOrderDrawerProps) {
  const router = useRouter();

  const handleClose = () => {
    router.refresh(); // Refresh to get updated data
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => !details.open && handleClose()}
      size="full"
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <HStack gap={2}>
              <IconButton
                aria-label="Volver"
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <LuArrowLeft />
              </IconButton>
              <Drawer.Title>
                {mode === "edit" ? "Editar Pedido Personalizado" : "Crear Pedido Personalizado"}
              </Drawer.Title>
            </HStack>
          </Drawer.Header>
          <Drawer.Body p={0}>
            <CustomOrderForm onClose={handleClose} mode={mode} orderId={orderId} />
          </Drawer.Body>
          <Drawer.CloseTrigger />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
