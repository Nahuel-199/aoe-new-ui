"use client";

import { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    Heading,
    Text,
} from "@chakra-ui/react";
import { createSubcategory } from "@/lib/actions/subcategory.actions";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";

export default function NewSubcategory() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createSubcategory({ name });
            toaster.success({
                title: 'Creado con exito',
                description:'Subcategoría creada con éxito'
            });
            setName("");
            router.push('/admin/subcategories');
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: 'Error al crear la Subcategoría'
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" rounded="lg" shadow="md">
            <Heading size="lg" mb={6}>
                Crear Subcategoría
            </Heading>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Input
                        placeholder="Nombre de la subcategoría (ej: Los Piojos)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Button type="submit" colorScheme="teal" loading={loading}>
                        Guardar Subcategoría
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
