"use client";

import { deleteCategory } from "@/lib/actions/category.actions";
import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Table,
    Tag,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmDeleteCategory from "./ConfirmDeleteCategory";

interface Category {
    _id: string;
    name: string;
}

export default function ListCategories({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [modalState, setModalState] = useState({
        open: false,
        mode: "create" as "create" | "edit",
        category: null as Category | null,
    });
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        await deleteCategory(categoryToDelete);
        setDeleteOpen(false);
        setCategoryToDelete(null);
        router.refresh();
    };

    const handleEditClick = (cat: Category) => {
        setModalState({ open: true, mode: "edit", category: cat });
    };

    const handleCreateClick = () => {
        setModalState({ open: true, mode: "create", category: null });
    };

    const handleCloseModal = () => {
        setModalState({ open: false, mode: "create", category: null });
    };

    return (
        <Box p={{ base: 0, md: 6 }} w="full" maxW="100%">
            <Flex mb={6}>
                <IconButton
                    aria-label="Agregar categoría"
                    variant="outline"
                    colorPalette="red"
                    onClick={handleCreateClick}
                    size={"sm"}
                    rounded={"full"}
                >
                    <FiPlus />
                </IconButton>
                <Heading size="2xl" ml={2} textAlign={"center"}>Categorías</Heading>
            </Flex>

            <Flex justify="center" w="full">
                <Box w="full" maxW={{ base: "100%", md: "100%" }}>
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign={"center"}>Nombre</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign={"center"}>Acciones</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {categories.map((cat) => (
                                <Table.Row key={cat._id}>
                                    <Table.Cell fontWeight="medium" textAlign={"center"}>{cat.name}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <HStack justify="center" gap={2}>
                                            <IconButton
                                                aria-label="Editar producto"
                                                size="sm"
                                                colorPalette="blue"
                                                variant={"outline"}
                                                onClick={() => handleEditClick(cat)}
                                            >
                                                <FiEdit />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Borrar producto"
                                                size="sm"
                                                colorPalette="red"
                                                variant={"outline"}
                                                onClick={() => handleDeleteClick(cat._id)}
                                            >
                                                <FiTrash />
                                            </IconButton>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Flex>
            <CategoryFormModal
                open={modalState.open}
                mode={modalState.mode}
                category={modalState.category}
                onClose={handleCloseModal}
            />
            <ConfirmDeleteCategory
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={confirmDelete}
                title="¿Eliminar categoría?"
                description="Esta acción no se puede deshacer. La categoría será eliminada permanentemente."
            />
        </Box>
    );
}
