"use client";

import { deleteShippingZone } from "@/lib/actions/shippingZone.actions";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { ShippingZone } from "@/types/shippingZone.types";
import ShippingZoneFormModal from "./ShippingZoneFormModal";
import ConfirmDeleteShippingZone from "./ConfirmDeleteShippingZone";

const ars = (n: number) => "$" + n.toLocaleString("es-AR");

export default function ListShippingZones({ zones }: { zones: ShippingZone[] }) {
  const router = useRouter();
  const [modalState, setModalState] = useState({
    open: false,
    mode: "create" as "create" | "edit",
    zone: null as ShippingZone | null,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setZoneToDelete(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!zoneToDelete) return;

    await deleteShippingZone(zoneToDelete);
    setDeleteOpen(false);
    setZoneToDelete(null);
    router.refresh();
  };

  const handleEditClick = (zone: ShippingZone) => {
    setModalState({ open: true, mode: "edit", zone });
  };

  const handleCreateClick = () => {
    setModalState({ open: true, mode: "create", zone: null });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, mode: "create", zone: null });
  };

  return (
    <Box p={{ base: 0, md: 6 }} w="full" maxW="100%">
      <Flex mb={6} align="center">
        <IconButton
          aria-label="Agregar zona de envío"
          variant="outline"
          colorPalette="red"
          onClick={handleCreateClick}
          size="sm"
          rounded="full"
        >
          <FiPlus />
        </IconButton>
        <Heading size="2xl" ml={2}>
          Zonas de envío
        </Heading>
      </Flex>

      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Nombre</Table.ColumnHeader>
            <Table.ColumnHeader>Provincias</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Rango de CP</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Costo</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {zones.map((zone) => (
            <Table.Row key={zone._id}>
              <Table.Cell fontWeight="medium">{zone.name}</Table.Cell>
              <Table.Cell>
                <Text fontSize="xs" color="gray.600">
                  {zone.provinces.join(", ")}
                </Text>
              </Table.Cell>
              <Table.Cell textAlign="center">
                {zone.postalCodeFrom && zone.postalCodeTo
                  ? `${zone.postalCodeFrom} - ${zone.postalCodeTo}`
                  : "—"}
              </Table.Cell>
              <Table.Cell textAlign="center">{ars(zone.cost)}</Table.Cell>
              <Table.Cell textAlign="center">
                <HStack justify="center" gap={2}>
                  <IconButton
                    aria-label="Editar zona"
                    size="sm"
                    colorPalette="blue"
                    variant="outline"
                    onClick={() => handleEditClick(zone)}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    aria-label="Borrar zona"
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    onClick={() => handleDeleteClick(zone._id)}
                  >
                    <FiTrash />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ShippingZoneFormModal
        open={modalState.open}
        mode={modalState.mode}
        zone={modalState.zone}
        onClose={handleCloseModal}
      />
      <ConfirmDeleteShippingZone
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
