"use client";

import { useState, useEffect } from "react";
import { Drawer, IconButton, HStack } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { Product, Category, Subcategory } from "@/types/product.types";
import { getProductById } from "@/lib/actions/product.actions";
import ProductFormContainer from "./ProductFormContainer";
import { useRouter } from "next/navigation";

interface ProductDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  productId?: string;
  categories: Category[];
  subcategories: Subcategory[];
  onClose: () => void;
}

export default function ProductDrawer({
  open,
  mode,
  productId,
  categories,
  subcategories,
  onClose,
}: ProductDrawerProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && productId && open) {
      setIsLoading(true);
      getProductById(productId)
        .then((data) => {
          if (data) {
            setProduct(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode === "create") {
      setProduct(null);
    }
  }, [mode, productId, open]);

  const handleClose = () => {
    setProduct(null);
    router.refresh(); // Refresh to get updated data
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => !details.open && handleClose()}
      size="full"
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <HStack gap={2}>
              <IconButton
                aria-label="Volver"
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                <LuArrowLeft />
              </IconButton>
              <Drawer.Title>
                {mode === "create" ? "Crear Producto" : "Editar Producto"}
              </Drawer.Title>
            </HStack>
          </Drawer.Header>
          <Drawer.Body p={0}>
            {isLoading ? (
              <div style={{ padding: "2rem", textAlign: "center" }}>
                Cargando producto...
              </div>
            ) : (mode === "create" || product) ? (
              <ProductFormContainer
                mode={mode}
                categories={categories}
                subcategories={subcategories}
                product={product || undefined}
                onClose={handleClose}
              />
            ) : null}
          </Drawer.Body>
          <Drawer.CloseTrigger />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
