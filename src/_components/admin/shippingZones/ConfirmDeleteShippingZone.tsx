"use client";

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

interface ConfirmDeleteShippingZoneProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteShippingZone({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteShippingZoneProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      role="alertdialog"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>¿Eliminar zona de envío?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Esta acción no se puede deshacer. Las direcciones que dependan de esta zona
                dejarán de tener un costo de envío calculado automáticamente.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={onConfirm}>
                Eliminar
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
