"use client";

import { useMemo, useState } from "react";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { CustomerOrder } from "@/types/order.types";
import OrderCard from "./OrderCard";

type TabValue = "all" | "active" | "shipped" | "delivered";

const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "En curso" },
  { value: "shipped", label: "En camino" },
  { value: "delivered", label: "Entregadas" },
];

function matchesTab(order: CustomerOrder, tab: TabValue) {
  switch (tab) {
    case "all":
      return true;
    case "active":
      return order.status !== "delivered" && order.status !== "cancelled";
    case "shipped":
      return order.status === "shipped";
    case "delivered":
      return order.status === "delivered";
  }
}

export default function OrdersByUser({ orders }: { orders: CustomerOrder[] }) {
  const [tab, setTab] = useState<TabValue>("all");

  const filtered = useMemo(() => orders.filter((o) => matchesTab(o, tab)), [orders, tab]);

  if (!orders || orders.length === 0) {
    return (
      <Box textAlign="center" py={16}>
        <Text fontFamily="heading" fontSize="2xl" textTransform="uppercase" color="aoe.text">
          Todavía no tenés pedidos
        </Text>
        <Text color="aoe.textSubtle" fontSize="sm" mt={2}>
          Cuando compres algo, lo vas a ver acá.
        </Text>
      </Box>
    );
  }

  return (
    <Box display="grid" gap={6}>
      <Flex
        gap={2}
        overflowX="auto"
        pb="6px"
        borderBottom="1px solid"
        borderColor="aoe.borderSubtle"
      >
        {TABS.map((t) => {
          const count = orders.filter((o) => matchesTab(o, t.value)).length;
          const active = tab === t.value;
          return (
            <Button
              key={t.value}
              onClick={() => setTab(t.value)}
              flexShrink={0}
              h="40px"
              px="16px"
              borderRadius="pill"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg={active ? "aoe.red" : "aoe.chip"}
              color={active ? "white" : "aoe.textMuted"}
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.05em"
              textTransform="uppercase"
              _hover={{ bg: active ? "aoe.red" : "aoe.surface" }}
            >
              {t.label}
              <Text as="span" fontFamily="mono" fontSize="10px" opacity={0.75} ml={2}>
                {count}
              </Text>
            </Button>
          );
        })}
      </Flex>

      {filtered.length === 0 ? (
        <Box
          border="1px dashed"
          borderColor="aoe.borderControl"
          borderRadius="20px"
          py={14}
          px={5}
          textAlign="center"
        >
          <Text fontFamily="heading" fontSize="28px" textTransform="uppercase" color="aoe.text">
            Nada por acá
          </Text>
          <Text color="aoe.textSubtle" fontSize="14px" mt="10px" mb="22px">
            No tenés pedidos en este estado.
          </Text>
          <Button
            onClick={() => setTab("all")}
            h="48px"
            px="24px"
            borderRadius="pill"
            bg="aoe.text"
            color="aoe.bg"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.08em"
            textTransform="uppercase"
            _hover={{ bg: "aoe.red", color: "white" }}
          >
            Ver todos
          </Button>
        </Box>
      ) : (
        <Grid gap={4}>
          {filtered.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </Grid>
      )}
    </Box>
  );
}
