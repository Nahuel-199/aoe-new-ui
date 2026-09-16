"use client";

import { Order } from "@/types/order.types";
import { Text, SimpleGrid } from "@chakra-ui/react";
import OrderCard from "./OrderCard";

export default function OrdersByUser({ orders }: { orders: Order[] }) {
    if (!orders || orders.length === 0) {
        return <Text mt={10}>Todavía no tenés pedidos.</Text>;
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
            ))}
        </SimpleGrid>
    );
}
