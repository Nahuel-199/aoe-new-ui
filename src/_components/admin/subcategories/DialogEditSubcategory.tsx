"use client";

import {
    Button,
    CloseButton,
    Dialog,
    Field,
    Input,
    Portal,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { updateSubcategory } from "@/lib/actions/subcategory.actions";
import { Subcategory } from "@/types/product.types";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

interface DialogEditsubcategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subcategory: Subcategory | null;
}

export default function DialogEditsubcategory({
    open,
    onOpenChange,
    subcategory,
}: DialogEditsubcategoryProps) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [types, setTypes] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name);
        }
    }, [subcategory]);

    const handleAddType = () => {
        setTypes([...types, ""]);
    };

    const handleSave = async () => {
        if (!subcategory) return;
        try {
            setLoading(true);
            await updateSubcategory(subcategory._id, { name });
            toaster.success({
                title: "Subcategoría actualizada",
                description: `Se actualizó "${name}" correctamente.`,
                duration: 3000,
            });
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            toaster.error({
                title: "Error",
                description: "No se pudo actualizar la subcategoría",
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
                            <Dialog.Title>Editar Subcategoría</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Field.Root mb={4}>
                                <Field.Label>Nombre</Field.Label>
                                <Input
                                    placeholder="Nombre de la subcategoría"
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
