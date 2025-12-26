"use client";

import { useState } from "react";
import { Box, VStack, Tabs } from "@chakra-ui/react";
import AdminHeader from "./AdminHeader";
import DashboardOverview from "./DashboardOverview";
import ListProducts from "../products/ListProducts";
import ProductDrawer from "../products/ProductDrawer";
import ListOrders from "../orders/ListOrders";
import OrderDetailsDrawer from "../orders/OrderDetailsDrawer";
import ListCategories from "../categories/ListCategories";
import ListSubcategories from "../subcategories/ListSubcategories";
import CustomOrderList from "../customOrders/CustomOrderList";
import CustomOrderDrawer from "../customOrders/CustomOrderDrawer";
import CategoryFormModal from "../categories/CategoryFormModal";
import { Product, Category, Subcategory } from "@/types/product.types";
import { Order } from "@/types/order.types";
import { CustomOrder } from "@/types/customOrder.types";

interface AdminDashboardContainerProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  orders: Order[];
  customOrders: CustomOrder[];
}

export default function AdminDashboardContainer({
  products,
  categories,
  subcategories,
  orders,
  customOrders,
}: AdminDashboardContainerProps) {
  // Tab state
  const [activeTab, setActiveTab] = useState("0");

  // Product drawer state
  const [productDrawer, setProductDrawer] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    productId: undefined as string | undefined,
  });

  // Order drawer state
  const [orderDrawer, setOrderDrawer] = useState({
    open: false,
    orderId: undefined as string | undefined,
  });

  // Custom order drawer state
  const [customOrderDrawerOpen, setCustomOrderDrawerOpen] = useState(false);

  // Category modal state
  const [categoryModal, setCategoryModal] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    category: null as Category | null,
  });

  // Handlers
  const handleOpenProductDrawer = (
    mode: "create" | "edit",
    productId?: string
  ) => {
    setProductDrawer({ open: true, mode, productId });
  };

  const handleCloseProductDrawer = () => {
    setProductDrawer({ open: false, mode: "create", productId: undefined });
  };

  const handleOpenOrderDrawer = (orderId: string) => {
    setOrderDrawer({ open: true, orderId });
  };

  const handleCloseOrderDrawer = () => {
    setOrderDrawer({ open: false, orderId: undefined });
  };

  const handleOpenCustomOrderDrawer = () => {
    setCustomOrderDrawerOpen(true);
  };

  const handleCloseCustomOrderDrawer = () => {
    setCustomOrderDrawerOpen(false);
  };

  const handleOpenCategoryModal = () => {
    setCategoryModal({ open: true, mode: "create", category: null });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ open: false, mode: "create", category: null });
  };

  return (
    <VStack align="stretch" gap={0} w="full" minH="100vh">
      <AdminHeader />

      <Box p={{ base: 4, md: 6 }}>
        <Tabs.Root
          value={activeTab}
          onValueChange={(details) => setActiveTab(details.value)}
          variant="enclosed"
          colorPalette="red"
        >
          <Tabs.List
            mb={4}
            overflowX={{ base: "auto", md: "visible" }}
            whiteSpace="nowrap"
            css={{
              // Estilos para scroll horizontal en móviles
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "var(--chakra-colors-gray-400)",
                borderRadius: "2px",
              },
            }}
            gap={{ base: 0, md: 1 }}
          >
            <Tabs.Trigger
              value="0"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Dashboard
            </Tabs.Trigger>
            <Tabs.Trigger
              value="1"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Productos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="2"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Categorías
            </Tabs.Trigger>
            <Tabs.Trigger
              value="3"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Subcategorías
            </Tabs.Trigger>
            <Tabs.Trigger
              value="4"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Órdenes
            </Tabs.Trigger>
            <Tabs.Trigger
              value="5"
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 2.5 }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Personalizados
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="0">
            <DashboardOverview
              products={products}
              categories={categories}
              orders={orders}
              customOrders={customOrders}
              onOpenProductDrawer={handleOpenProductDrawer}
              onOpenCategoryModal={handleOpenCategoryModal}
              onOpenCustomOrderDrawer={handleOpenCustomOrderDrawer}
            />
          </Tabs.Content>

          <Tabs.Content value="1">
            <ListProducts
              products={products}
              categories={categories}
              subcategories={subcategories}
              onOpenDrawer={handleOpenProductDrawer}
            />
          </Tabs.Content>

          <Tabs.Content value="2">
            <ListCategories categories={categories} />
          </Tabs.Content>

          <Tabs.Content value="3">
            <ListSubcategories subcategories={subcategories} />
          </Tabs.Content>

          <Tabs.Content value="4">
            <ListOrders
              orders={orders}
              onOpenDrawer={handleOpenOrderDrawer}
            />
          </Tabs.Content>

          <Tabs.Content value="5">
            <CustomOrderList
              orders={customOrders}
              onOpenDrawer={handleOpenCustomOrderDrawer}
            />
          </Tabs.Content>
        </Tabs.Root>
      </Box>

      {/* Overlay Drawers/Modals */}
      <ProductDrawer
        open={productDrawer.open}
        mode={productDrawer.mode}
        productId={productDrawer.productId}
        categories={categories}
        subcategories={subcategories}
        onClose={handleCloseProductDrawer}
      />
      <OrderDetailsDrawer
        open={orderDrawer.open}
        orderId={orderDrawer.orderId}
        onClose={handleCloseOrderDrawer}
      />
      <CustomOrderDrawer
        open={customOrderDrawerOpen}
        onClose={handleCloseCustomOrderDrawer}
      />
      <CategoryFormModal
        open={categoryModal.open}
        mode={categoryModal.mode}
        category={categoryModal.category}
        onClose={handleCloseCategoryModal}
      />
    </VStack>
  );
}
