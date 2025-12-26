"use client";

import { useState, useEffect } from "react";
import { Drawer } from "@chakra-ui/react";
import { Order } from "@/types/order.types";
import { getOrderById } from "@/lib/actions/order.actions";
import OrderById from "./OrderById";
import { useRouter } from "next/navigation";

interface OrderDetailsDrawerProps {
  open: boolean;
  orderId?: string;
  onClose: () => void;
}

export default function OrderDetailsDrawer({
  open,
  orderId,
  onClose,
}: OrderDetailsDrawerProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderId && open) {
      setIsLoading(true);
      getOrderById(orderId)
        .then((data) => {
          if (data) {
            setOrder(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [orderId, open]);

  const handleClose = () => {
    setOrder(null);
    router.refresh(); // Refresh to get updated data
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => !details.open && handleClose()}
      size="lg"
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Detalles de la Orden</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body p={0}>
            {isLoading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Cargando orden...
              </div>
            ) : order ? (
              <OrderById orders={order} onClose={handleClose} />
            ) : null}
          </Drawer.Body>
          <Drawer.CloseTrigger />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
