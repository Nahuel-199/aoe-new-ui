"use client";

import { useState, useEffect } from "react";
import { Dialog, Portal, Input, Button, VStack, Field } from "@chakra-ui/react";
import { Category } from "@/types/product.types";
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface CategoryFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  category?: Category | null;
  onClose: () => void;
}

export default function CategoryFormModal({
  open,
  mode,
  category,
  onClose,
}: CategoryFormModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [mode, category, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toaster.error({ title: "El nombre es requerido" });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "create") {
        await createCategory({ name });
        toaster.success({ title: "Categoría creada exitosamente" });
      } else if (category) {
        await updateCategory(category._id, { name });
        toaster.success({ title: "Categoría actualizada exitosamente" });
      }
      router.refresh();
      onClose();
    } catch (error) {
      toaster.error({
        title: mode === "create" ? "Error al crear categoría" : "Error al actualizar categoría",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "Crear Categoría" : "Editar Categoría"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4}>
                <Field.Root>
                  <Field.Label>Nombre</Field.Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la categoría"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorPalette="red"
                onClick={handleSubmit}
                loading={isLoading}
              >
                {mode === "create" ? "Crear" : "Guardar"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
