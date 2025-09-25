"use client";

import {
    Box,
    Flex,
    Heading,
    HStack,
    IconButton,
    Table,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import DialogEditsubcategory from "./DialogEditSubcategory";
import { deleteSubcategory } from "@/lib/actions/subcategory.actions";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

interface Subcategory {
    _id: string;
    name: string;
}

export default function ListSubsubcategories({ subcategories }: { subcategories: Subcategory[] }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Subcategory | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null);
    const router = useRouter();

    const handleDeleteClick = (id: string) => {
        setSubcategoryToDelete(id);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!subcategoryToDelete) return;

        await deleteSubcategory(subcategoryToDelete);
        setDeleteOpen(false);
        setSubcategoryToDelete(null);
        router.refresh();
    };

    const handleEditClick = (cat: Subcategory) => {
        setSelected(cat);
        setOpen(true);
    };

    return (
        <Box p={{ base: 0, md: 6 }} w="full" maxW="100%">
            <Flex mb={6}>
                <IconButton
                    aria-label="Agregar subcategoría"
                    variant="outline"
                    colorPalette="red"
                    onClick={() => router.push("/admin/subcategories/new")}
                    size={"sm"}
                    rounded={"full"}
                >
                    <FiPlus />
                </IconButton>
                <Heading size="2xl" ml={2} textAlign={"center"}>
                    Subcategorías
                </Heading>
            </Flex>

            <Flex justify="center" w="full">
                <Box w="full" maxW={{ base: "100%", md: "100%" }}>
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader textAlign="center">Nombre</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">Acciones</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {subcategories.map((cat) => (
                                <Table.Row key={cat._id}>
                                    <Table.Cell fontWeight="medium" textAlign="center">{cat.name}</Table.Cell>
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
            <DialogEditsubcategory
                open={open}
                onOpenChange={setOpen}
                subcategory={selected}
            />
            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={confirmDelete}
                title="¿Eliminar subcategoría?"
                description="Esta acción no se puede deshacer. La subcategoría será eliminada permanentemente."
            />
        </Box>
    );
}
