"use client";

import { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    Heading,
} from "@chakra-ui/react";
import { createCategory } from "@/lib/actions/category.actions";
import { toaster } from "@/components/ui/toaster";

export default function NewCategory() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createCategory({ name });
            toaster.success({
                title: 'Creado con exito',
                description: 'Categoría creada con éxito'
            });
            setName("");
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: 'Error al crear la Categoría'
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" rounded="lg" shadow="md">
            <Heading size="lg" mb={6}>
                Crear Categoría
            </Heading>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Input
                        placeholder="Nombre de la categoría (ej: Remeras)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Button type="submit" colorScheme="teal" loading={loading}>
                        Guardar Categoría
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
