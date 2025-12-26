"use client";

import { SimpleGrid, Card, HStack, VStack, Text, Icon } from "@chakra-ui/react";
import { Product, Category } from "@/types/product.types";
import { Order } from "@/types/order.types";
import { CustomOrder } from "@/types/customOrder.types";
import { LuPackage, LuShoppingCart, LuDollarSign, LuFolderOpen, LuClipboardList, LuTriangleAlert } from "react-icons/lu";

interface StatisticsCardsProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customOrders: CustomOrder[];
}

export default function StatisticsCards({
  products,
  categories,
  orders,
  customOrders,
}: StatisticsCardsProps) {
  // Calculate statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalOrders = orders.length;

  const pendingCustomOrders = customOrders.filter(
    (o) => o.status === "pending" || o.status === "in_progress"
  ).length;

  // Calculate total revenue from completed orders
  const completedOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "confirmed"
  );
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

  // Calculate low stock products (products with any variant size < 5 stock)
  const lowStockProducts = products.filter((product) =>
    product.variants.some((variant) =>
      variant.sizes.some((size) => size.stock < 5 && size.stock > 0)
    )
  ).length;

  const stats = [
    {
      label: "Total Productos",
      value: totalProducts,
      icon: LuPackage,
      colorScheme: "blue",
    },
    {
      label: "Órdenes Pendientes",
      value: `${pendingOrders}/${totalOrders}`,
      icon: LuShoppingCart,
      colorScheme: "yellow",
    },
    {
      label: "Ingresos",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: LuDollarSign,
      colorScheme: "green",
    },
    {
      label: "Categorías",
      value: totalCategories,
      icon: LuFolderOpen,
      colorScheme: "purple",
    },
    {
      label: "Pedidos Personalizados",
      value: pendingCustomOrders,
      icon: LuClipboardList,
      colorScheme: "teal",
    },
    {
      label: "Stock Bajo",
      value: lowStockProducts,
      icon: LuTriangleAlert,
      colorScheme: "red",
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
      {stats.map((stat, index) => (
        <Card.Root key={index} size="sm">
          <Card.Body>
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="fg.muted">
                  {stat.label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {stat.value}
                </Text>
              </VStack>
              <Icon boxSize={10} color={`${stat.colorScheme}.500`}>
                <stat.icon />
              </Icon>
            </HStack>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}
