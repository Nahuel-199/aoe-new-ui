"use client";

import { Order } from "@/types/order.types";
import {
    Box,
    VStack,
    Text,
    HStack,
    Image,
    Badge,
    SimpleGrid,
    Flex,
} from "@chakra-ui/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import {
    FaClock,
    FaCheckCircle,
    FaTruck,
    FaBoxOpen,
    FaTimesCircle,
} from "react-icons/fa";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    shipped: "En camino",
    delivered: "Entregada",
    cancelled: "Cancelada",
};

const STATUS_ICONS: Record<string, any> = {
    pending: FaClock,
    confirmed: FaCheckCircle,
    shipped: FaTruck,
    delivered: FaBoxOpen,
    cancelled: FaTimesCircle,
};

export default function OrdersByUser({ orders }: { orders: Order[] }) {
    if (!orders || orders.length === 0) {
        return <Text mt={10}>Todavía no tenés pedidos.</Text>;
    }

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
            {orders.map((order) => {
                const currentIndex = ORDER_STATUSES.indexOf(order.status);
                const timelineRef = useRef<HTMLDivElement[]>([]);

                useEffect(() => {
                    if (timelineRef.current) {
                        gsap.killTweensOf(timelineRef.current);

                        gsap.set(timelineRef.current, { opacity: 0, scale: 0.8 });

                        gsap.to(timelineRef.current, {
                            opacity: 1,
                            scale: 1,
                            stagger: 0.15,
                            ease: "back.out(1.7)",
                            duration: 0.6,
                        });
                    }
                }, [order.status]);

                return (
                    <Box
                        w="90%"
                        mx="auto"
                        key={order._id}
                        borderWidth="1px"
                        borderRadius="xl"
                        overflow="hidden"
                        shadow="md"
                        transition="all 0.2s"
                        _hover={{ transform: "scale(1.02)" }}
                        p={6}
                        mt={6}
                        bg="bg"
                        maxW="2xl"
                    >
                        <HStack justify="space-between" mb={3}>
                            <Badge
                                colorPalette={
                                    order.status === "pending"
                                        ? "yellow"
                                        : order.status === "confirmed"
                                            ? "blue"
                                            : order.status === "shipped"
                                                ? "purple"
                                                : order.status === "delivered"
                                                    ? "green"
                                                    : "red"
                                }
                            >
                                {STATUS_LABELS[order.status]}
                            </Badge>
                        </HStack>

                        <Box
                            display={{ base: "flex", md: "flex" }}
                            flexDir={{ base: "column", md: "row" }}
                            alignItems={{ base: "stretch", md: "center" }}
                            justifyContent={{ base: "flex-start", md: "center" }}
                            gap={{ base: 4, md: 6 }}
                            mb={6}
                        >
                            {ORDER_STATUSES.map((status, idx) => {
                                const Icon = STATUS_ICONS[status];
                                const active = idx <= currentIndex;
                                return (
                                    <Flex
                                        key={status}
                                        ref={(el) => {
                                            if (el) timelineRef.current[idx] = el;
                                        }}
                                        align="center"
                                        gap={2}
                                        flexDir={{ base: "row", md: "column" }}
                                        textAlign={{ base: "left", md: "center" }}
                                    >
                                        <Box
                                            as={Icon}
                                            boxSize={{ base: 5, md: 6 }}
                                            color={active ? "teal.500" : "gray.400"}
                                        />
                                        <Text
                                            fontSize={{ base: "sm", md: "sm" }}
                                            color={active ? "teal.600" : "gray.400"}
                                            whiteSpace="nowrap"
                                        >
                                            {STATUS_LABELS[status]}
                                        </Text>
                                    </Flex>
                                );
                            })}
                        </Box>
                        <VStack align="stretch" gap={3}>
                            {order.items.map((item, idx) => (
                                <HStack
                                    key={idx}
                                    gap={3}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    p={2}
                                >
                                    {item.variant.imageUrl && (
                                        <Image
                                            src={item.variant.imageUrl}
                                            alt={item.product.name}
                                            boxSize="120px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                    )}
                                    <Box>
                                        <Text fontWeight="medium" fontSize={{ base: "md", md: "md" }}>
                                            {item.product.name}
                                        </Text>
                                        <Text fontSize={{ base: "md", md: "md" }} color="gray">
                                            {item.variant.type}, {item.variant.color}, {item.variant.size} ×{" "}
                                            {item.variant.quantity}
                                        </Text>
                                    </Box>
                                </HStack>
                            ))}
                        </VStack>

                        <HStack justify="flex-end" mt={4}>
                            <Text fontWeight="bold" fontSize="lg" color="white">
                                Total:
                            </Text>
                            <Text fontWeight="bold" fontSize="lg" color="red.500">
                                ${order.total}
                            </Text>
                        </HStack>
                    </Box>
                );
            })}
        </SimpleGrid>
    );
}
