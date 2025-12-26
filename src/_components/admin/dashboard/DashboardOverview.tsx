"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  VStack,
  Button,
  Text,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Product, Category } from "@/types/product.types";
import { Order } from "@/types/order.types";
import { CustomOrder } from "@/types/customOrder.types";
import StatisticsCards from "./StatisticsCards";
import { LuPlus, LuPackagePlus, LuFolderPlus } from "react-icons/lu";

interface DashboardOverviewProps {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customOrders: CustomOrder[];
  onOpenProductDrawer: (mode: "create" | "edit", productId?: string) => void;
  onOpenCategoryModal?: () => void;
  onOpenCustomOrderDrawer?: () => void;
}

export default function DashboardOverview({
  products,
  categories,
  orders,
  customOrders,
  onOpenProductDrawer,
  onOpenCategoryModal,
  onOpenCustomOrderDrawer,
}: DashboardOverviewProps) {

  const recentOrders = orders.slice(0, 5);

  const STATUS_COLORS: Record<string, string> = {
    pending: "yellow",
    confirmed: "blue",
    shipped: "purple",
    delivered: "green",
    cancelled: "red",
  };

  const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return (
    <Box>
      <Heading size="xl" mb={6}>
        Dashboard
      </Heading>

      <StatisticsCards
        products={products}
        categories={categories}
        orders={orders}
        customOrders={customOrders}
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} mt={8}>
        <Card.Root>
          <Card.Header>
            <Heading size="md">Órdenes Recientes</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={3}>
              {recentOrders.length === 0 ? (
                <Text color="fg.muted">No hay órdenes recientes</Text>
              ) : (
                recentOrders.map((order) => (
                  <Box
                    key={order._id}
                    p={3}
                    borderWidth="1px"
                    rounded="md"
                    _hover={{ bg: "bg.subtle" }}
                  >
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="medium">{order.user.name}</Text>
                      <Badge colorPalette={STATUS_COLORS[order.status]}>
                        {STATUS_LABELS[order.status]}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" fontSize="sm" color="fg.muted">
                      <Text>{order.items.length} producto(s)</Text>
                      <Text fontWeight="semibold">${order.total}</Text>
                    </HStack>
                  </Box>
                ))
              )}
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Heading size="md">Acciones Rápidas</Heading>
          </Card.Header>
          <Card.Body>
            <VStack gap={3} align="stretch">
              <Button
                colorPalette="red"
                size="lg"
                onClick={() => onOpenProductDrawer("create")}
              >
                <LuPackagePlus />
                Crear Producto
              </Button>

              <Button
                variant="outline"
                colorPalette="blue"
                size="lg"
                onClick={onOpenCategoryModal}
              >
                <LuFolderPlus />
                Crear Categoría
              </Button>

              <Button
                variant="outline"
                colorPalette="purple"
                size="lg"
                onClick={onOpenCustomOrderDrawer}
              >
                <LuPlus />
                Pedido Personalizado
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {products.filter(
        (p) =>
          p.variants.some((v) =>
            v.sizes.some((s) => s.stock < 5 && s.stock > 0)
          )
      ).length > 0 && (
        <Card.Root mt={6}>
          <Card.Header>
            <Heading size="md">Productos con Stock Bajo</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={2}>
              {products
                .filter((p) =>
                  p.variants.some((v) =>
                    v.sizes.some((s) => s.stock < 5 && s.stock > 0)
                  )
                )
                .slice(0, 5)
                .map((product) => (
                  <HStack
                    key={product._id}
                    justify="space-between"
                    p={2}
                    borderWidth="1px"
                    rounded="md"
                  >
                    <Text>{product.name}</Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenProductDrawer("edit", product._id)}
                    >
                      Editar
                    </Button>
                  </HStack>
                ))}
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  );
}
