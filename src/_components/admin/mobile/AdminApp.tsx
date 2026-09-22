"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import { showToast } from "nextjs-toast-notify";
import { Product, Category, Subcategory } from "@/types/product.types";
import { AdminOrder } from "@/types/order.types";
import { CustomOrder } from "@/types/customOrder.types";
import { ShippingZone } from "@/types/shippingZone.types";
import { HeroBanner } from "@/types/heroBanner.types";
import {
  AdminScreen,
  AdminTab,
  OrderTabValue,
  ProductFilterValue,
} from "@/lib/constants/adminNav";
import { updateOrderStatus, cancelOrderAndRestoreStock } from "@/lib/actions/order.actions";
import { updateCustomOrder } from "@/lib/actions/customOrder.action";
import { createProduct, deleteProduct } from "@/lib/actions/product.actions";
import { getTotalStock, isLowStock } from "@/lib/productStock";

import AdminHeaderMobile from "./AdminHeaderMobile";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";
import BottomSheet, { SheetConfig } from "./BottomSheet";
import PanelScreen from "./screens/PanelScreen";
import ProductsScreen from "./screens/ProductsScreen";
import ProductFormScreen from "./screens/ProductFormScreen";
import OrdersScreen from "./screens/OrdersScreen";
import CustomScreen from "./screens/CustomScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import ShippingZonesScreen from "./screens/ShippingZonesScreen";
import HeroBannersScreen from "./screens/HeroBannersScreen";
import CustomOrderDrawer from "../customOrders/CustomOrderDrawer";

function notify(kind: "success" | "error", message: string) {
  showToast[kind](message, { duration: 3000, progress: true, position: "top-center" });
}

const DESKTOP_BREAKPOINT = 960;

interface AdminAppProps {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  orders: AdminOrder[];
  customOrders: CustomOrder[];
  shippingZones: ShippingZone[];
  heroBanners: (HeroBanner | null)[];
}

const SCREEN_TITLES: Record<AdminScreen, [string, string]> = {
  home: ["Panel", "Resumen de hoy"],
  products: ["Productos", ""],
  form: ["Producto", ""],
  orders: ["Órdenes", ""],
  custom: ["Personalizados", ""],
  categories: ["Categorías", "Categorías y subcategorías"],
  shipping: ["Envíos", "Zonas de envío"],
  hero: ["Portada", "Imágenes del hero"],
};

export default function AdminApp({
  products,
  categories,
  subcategories,
  orders,
  customOrders,
  shippingZones,
  heroBanners,
}: AdminAppProps) {
  const router = useRouter();

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [tab, setTab] = useState<AdminScreen>("home");
  const [query, setQuery] = useState("");
  const [prodFilter, setProdFilter] = useState<ProductFilterValue>("all");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderTab, setOrderTab] = useState<OrderTabValue>("all");
  const [sheet, setSheet] = useState<SheetConfig | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [customDrawer, setCustomDrawer] = useState<{
    open: boolean;
    mode: "create" | "edit";
    orderId?: string;
  }>({ open: false, mode: "create" });

  const refresh = () => router.refresh();

  const go = (screen: AdminScreen) => {
    setTab(screen);
    setSheet(null);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const goOrders = (ot: OrderTabValue, q?: string) => {
    setOrderTab(ot);
    if (q !== undefined) setOrderQuery(q);
    go("orders");
  };

  const goProducts = (f: ProductFilterValue) => {
    setProdFilter(f);
    go("products");
  };

  const goForm = (product: Product | null) => {
    setEditingProduct(product);
    go("form");
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const lowStockCount = products.filter(isLowStock).length;
  const outOfStockCount = products.filter((p) => getTotalStock(p) === 0).length;
  const hasAlerts = pendingCount + lowStockCount + outOfStockCount > 0;

  const [titleBase, subBase] = SCREEN_TITLES[tab];
  const screenSub =
    tab === "products"
      ? `${products.length} publicados`
      : tab === "orders"
      ? `${pendingCount} esperando acción`
      : tab === "custom"
      ? `${customOrders.length} pedidos activos`
      : tab === "form"
      ? editingProduct
        ? "Editar producto"
        : "Nuevo producto"
      : subBase;

  const showNav = tab === "home" || tab === "products" || tab === "orders" || tab === "custom";
  const showBack = !showNav;

  const mw = isDesktop ? "1320px" : "760px";
  const mainMarginLeft = isDesktop ? "236px" : "0";
  const rootPadBottom = isDesktop ? "24px" : "104px";

  const handleOpenAlerts = () => {
    setSheet({
      title: "Alertas",
      subtitle: "Lo que necesita tu atención hoy",
      actions: [
        {
          label: `${pendingCount} órdenes pendientes de pago`,
          color: "#fbbf24",
          onClick: () => goOrders("pending"),
        },
        {
          label: `${lowStockCount} productos con stock bajo`,
          onClick: () => goProducts("lowStock"),
        },
        {
          label: `${outOfStockCount} agotados aún publicados`,
          color: "#ff6b76",
          onClick: () => goProducts("outOfStock"),
        },
      ],
    });
  };

  const handleSetOrderStatus = async (order: AdminOrder, status: AdminOrder["status"]) => {
    if (status === order.status) return;
    const ok =
      status === "cancelled"
        ? await cancelOrderAndRestoreStock(order._id, "cancelled")
        : await updateOrderStatus(order._id, status);
    if (ok) {
      notify("success", `Orden #${order._id.slice(-8)} → ${status}`);
      refresh();
    } else {
      notify("error", "No pudimos actualizar la orden");
    }
  };

  const handleAdvanceCustom = async (order: CustomOrder, next: CustomOrder["status"]) => {
    const result = await updateCustomOrder(order._id, { status: next });
    notify(result.success ? "success" : "error", result.message || "Pedido actualizado");
    if (result.success) refresh();
  };

  const handleOpenProductMenu = (product: Product) => {
    setSheet({
      title: product.name,
      subtitle: `${product.category?.name || ""} · ${getTotalStock(product)} unidades`,
      actions: [
        { label: "Editar producto", onClick: () => goForm(product) },
        {
          label: "Duplicar",
          onClick: async () => {
            setSheet(null);
            try {
              await createProduct({
                name: product.name + " (copia)",
                description: product.description || "",
                category: product.category._id,
                subcategories: product.subcategories?.map((s) => s._id) || [],
                variants: product.variants,
              });
              notify("success", `${product.name} duplicado`);
              refresh();
            } catch {
              notify("error", "No pudimos duplicar el producto");
            }
          },
        },
        {
          label: "Eliminar",
          color: "#ff6b76",
          onClick: () => {
            setSheet({
              title: "¿Eliminar producto?",
              subtitle: "Esta acción no se puede deshacer",
              actions: [
                {
                  label: "Sí, eliminar",
                  color: "#ff6b76",
                  onClick: async () => {
                    setSheet(null);
                    try {
                      await deleteProduct(product._id);
                      notify("success", `${product.name} eliminado`);
                      refresh();
                    } catch {
                      notify("error", "No pudimos eliminar el producto");
                    }
                  },
                },
                { label: "Cancelar", onClick: () => setSheet(null) },
              ],
            });
          },
        },
      ],
    });
  };

  return (
    <Box bg="aoe.bg" color="aoe.text" minH="100vh" pb={rootPadBottom}>
      <AdminHeaderMobile
        title={titleBase}
        subtitle={screenSub}
        hasAlerts={hasAlerts}
        onOpenAlerts={handleOpenAlerts}
        onBack={showBack ? () => go(tab === "form" ? "products" : "home") : undefined}
        onLogoClick={() => router.push("/")}
        maxW={mw}
        isDesktop={isDesktop}
      />

      <Box
        maxW={mw}
        mx={isDesktop ? undefined : "auto"}
        ml={isDesktop ? mainMarginLeft : undefined}
        px={4}
        pt="18px"
      >
        {tab === "home" && (
          <PanelScreen
            products={products}
            orders={orders}
            onGoOrders={goOrders}
            onGoProducts={goProducts}
            onGoCustom={() => go("custom")}
            onGoForm={() => goForm(null)}
            onGoCategories={() => go("categories")}
            onGoHero={() => go("hero")}
          />
        )}
        {tab === "products" && (
          <ProductsScreen
            products={products}
            query={query}
            onQueryChange={setQuery}
            filter={prodFilter}
            onFilterChange={setProdFilter}
            onCreate={() => goForm(null)}
            onEdit={(p) => goForm(p)}
            onOpenMenu={handleOpenProductMenu}
          />
        )}
        {tab === "form" && (
          <ProductFormScreen
            product={editingProduct || undefined}
            categories={categories}
            subcategories={subcategories}
            onCancel={() => go("products")}
            onSaved={() => {
              refresh();
              go("products");
            }}
            isDesktop={isDesktop}
          />
        )}
        {tab === "orders" && (
          <OrdersScreen
            orders={orders}
            query={orderQuery}
            onQueryChange={setOrderQuery}
            orderTab={orderTab}
            onOrderTabChange={setOrderTab}
            onSetStatus={handleSetOrderStatus}
          />
        )}
        {tab === "custom" && (
          <CustomScreen
            customOrders={customOrders}
            onCreate={() => setCustomDrawer({ open: true, mode: "create" })}
            onEdit={(o) => setCustomDrawer({ open: true, mode: "edit", orderId: o._id })}
            onAdvance={handleAdvanceCustom}
          />
        )}
        {tab === "categories" && (
          <CategoriesScreen categories={categories} subcategories={subcategories} />
        )}
        {tab === "shipping" && <ShippingZonesScreen zones={shippingZones} />}
        {tab === "hero" && <HeroBannersScreen banners={heroBanners} isDesktop={isDesktop} />}
      </Box>

      {showNav && !isDesktop && <BottomNav active={tab as AdminTab} onChange={go} />}
      {showNav && isDesktop && <DesktopSidebar active={tab as AdminTab} onChange={go} />}

      <BottomSheet sheet={sheet} onClose={() => setSheet(null)} isDesktop={isDesktop} />

      <CustomOrderDrawer
        open={customDrawer.open}
        mode={customDrawer.mode}
        orderId={customDrawer.orderId}
        onClose={() => setCustomDrawer({ open: false, mode: "create" })}
      />
    </Box>
  );
}
