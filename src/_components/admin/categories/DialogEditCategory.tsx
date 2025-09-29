"use client";

import {
    Button,
    CloseButton,
    Dialog,
    Field,
    HStack,
    IconButton,
    Input,
    Portal,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { updateCategory } from "@/lib/actions/category.actions";
import { Category } from "@/types/product.types";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { FiPlus, FiTrash } from "react-icons/fi";

interface DialogEditCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
}

export default function DialogEditCategory({
    open,
    onOpenChange,
    category,
}: DialogEditCategoryProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSave = async () => {
        if (!category) return;
        try {
            setLoading(true);
            await updateCategory(category._id, { name});
            toaster.success({
                title: "Categoría actualizada",
                description: `Se actualizó "${name}" correctamente.`,
                duration: 3000,
            });
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "No se pudo actualizar la categoría",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => onOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Editar Categoría</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Field.Root mb={4}>
                                <Field.Label>Nombre</Field.Label>
                                <Input
                                    placeholder="Nombre de la categoría"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    mt={2}
                                />
                            </Field.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.ActionTrigger>
                            <Button colorScheme="teal" onClick={handleSave} loading={loading}>
                                Guardar
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}
