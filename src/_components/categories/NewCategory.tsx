"use client";

import { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    Heading,
    Text,
    Tag,
    HStack,
} from "@chakra-ui/react";
import { createCategory } from "@/lib/actions/category.actions";
import { toaster } from "@/components/ui/toaster";

export default function NewCategory() {
    const [name, setName] = useState("");
    const [typeInput, setTypeInput] = useState("");
    const [types, setTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddType = () => {
        if (typeInput.trim() && !types.includes(typeInput)) {
            setTypes([...types, typeInput.trim()]);
            setTypeInput("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createCategory({ name, types });
            toaster.success({
                title: 'Creado con exito',
                description: 'Categoría creada con éxito'
            });
            setName("");
            setTypes([]);
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

                    <HStack>
                        <Input
                            placeholder="Tipo (ej: oversize, niños...)"
                            value={typeInput}
                            onChange={(e) => setTypeInput(e.target.value)}
                        />
                        <Button onClick={handleAddType} colorScheme="teal">
                            Agregar
                        </Button>
                    </HStack>

                    <HStack wrap="wrap">
                        {types.map((t, i) => (
                            <Tag.Root key={i} colorScheme="blue">
                                <Tag.Label>{t}</Tag.Label>
                            </Tag.Root>
                        ))}
                    </HStack>

                    <Button type="submit" colorScheme="teal" loading={loading}>
                        Guardar Categoría
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
