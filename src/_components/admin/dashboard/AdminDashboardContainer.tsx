"use client";

import { useState } from "react";
import { Box, VStack, Tabs, Drawer, IconButton, Stack, Text, Portal } from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { MdDashboard, MdShoppingBag, MdCategory, MdList, MdReceipt, MdDesignServices } from "react-icons/md";
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

const menuItems = [
  { label: "Dashboard", value: "0", icon: MdDashboard },
  { label: "Productos", value: "1", icon: MdShoppingBag },
  { label: "Categorías", value: "2", icon: MdCategory },
  { label: "Subcategorías", value: "3", icon: MdList },
  { label: "Órdenes", value: "4", icon: MdReceipt },
  { label: "Personalizados", value: "5", icon: MdDesignServices },
];

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

  const [activeTab, setActiveTab] = useState("0");
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const [productDrawer, setProductDrawer] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    productId: undefined as string | undefined,
  });

  const [orderDrawer, setOrderDrawer] = useState({
    open: false,
    orderId: undefined as string | undefined,
  });

  const [customOrderDrawer, setCustomOrderDrawer] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    orderId: undefined as string | undefined,
  });

  const [categoryModal, setCategoryModal] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    category: null as Category | null,
  });

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

  const handleOpenCustomOrderDrawer = (mode: "create" | "edit" = "create", orderId?: string) => {
    setCustomOrderDrawer({ open: true, mode, orderId });
  };

  const handleCloseCustomOrderDrawer = () => {
    setCustomOrderDrawer({ open: false, mode: "create", orderId: undefined });
  };

  const handleOpenCategoryModal = () => {
    setCategoryModal({ open: true, mode: "create", category: null });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ open: false, mode: "create", category: null });
  };

  const handleMenuItemClick = (value: string) => {
    setActiveTab(value);
    setMenuDrawerOpen(false);
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

          <Box display={{ base: "block", md: "none" }} mb={4}>
            <IconButton
              aria-label="Abrir menú de navegación"
              onClick={() => setMenuDrawerOpen(true)}
              size="md"
              variant="outline"
              colorPalette="red"
            >
              <HiMenu />
            </IconButton>
          </Box>

          <Tabs.List
            display={{ base: "none", md: "flex" }}
            mb={4}
            gap={1}
          >
            <Tabs.Trigger value="0" px={4} py={2.5}>
              Dashboard
            </Tabs.Trigger>
            <Tabs.Trigger value="1" px={4} py={2.5}>
              Productos
            </Tabs.Trigger>
            <Tabs.Trigger value="2" px={4} py={2.5}>
              Categorías
            </Tabs.Trigger>
            <Tabs.Trigger value="3" px={4} py={2.5}>
              Subcategorías
            </Tabs.Trigger>
            <Tabs.Trigger value="4" px={4} py={2.5}>
              Órdenes
            </Tabs.Trigger>
            <Tabs.Trigger value="5" px={4} py={2.5}>
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
        open={customOrderDrawer.open}
        mode={customOrderDrawer.mode}
        orderId={customOrderDrawer.orderId}
        onClose={handleCloseCustomOrderDrawer}
      />
      <CategoryFormModal
        open={categoryModal.open}
        mode={categoryModal.mode}
        category={categoryModal.category}
        onClose={handleCloseCategoryModal}
      />

      <Drawer.Root
        open={menuDrawerOpen}
        onOpenChange={(details) => setMenuDrawerOpen(details.open)}
        placement="start"
        size="xs"
      >
          <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Menú</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body p={0}>
              <Stack gap={0}>
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.value;
                  return (
                    <Box
                      key={item.value}
                      as="button"
                      onClick={() => handleMenuItemClick(item.value)}
                      px={4}
                      py={3}
                      display="flex"
                      alignItems="center"
                      gap={3}
                      w="full"
                      bg={isActive ? "red.50" : "transparent"}
                      color={isActive ? "red.600" : "gray.700"}
                      fontWeight={isActive ? "semibold" : "normal"}
                      borderLeftWidth={3}
                      cursor={"pointer"}
                      borderLeftColor={isActive ? "red.600" : "transparent"}
                      _hover={{
                        bg: isActive ? "red.50" : "gray.50",
                      }}
                      transition="all 0.2s"
                    >
                      <Icon size={20} />
                      <Text fontSize="md">{item.label}</Text>
                    </Box>
                  );
                })}
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger />
          </Drawer.Content>
        </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </VStack>
  );
}
