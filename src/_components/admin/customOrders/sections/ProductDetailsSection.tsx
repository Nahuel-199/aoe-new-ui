"use client";

import { Card, Grid, Box, Field, Input, VStack, Button, Flex, Heading } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ProductDetailsSection({
  items,
  addItem,
  removeItem,
  handleItemChange,
}: any) {
  return (
    <>
      <Card.Root variant="elevated" mt={6}>
        <Card.Header>
          <Heading size="md">Detalles del producto</Heading>
        </Card.Header>
        <Card.Body>
          <VStack gap={6} align="stretch">
            {items.map((item: any, index: number) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  {["name", "description", "color", "size", "quantity", "price"].map((field) => (
                    <Box key={field}>
                      <Field.Root>
                        <Field.Label>
                          {field === "name"
                            ? "Nombre"
                            : field === "description"
                            ? "Descripción"
                            : field === "color"
                            ? "Color"
                            : field === "size"
                            ? "Talle"
                            : field === "quantity"
                            ? "Cantidad"
                            : "Precio"}
                        </Field.Label>
                        <Input
                          type={field === "quantity" || field === "price" ? "number" : "text"}
                          name={`items[${index}][${field}]`}
                          value={item[field]}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              field,
                              field === "quantity" || field === "price"
                                ? Number(e.target.value)
                                : e.target.value
                            )
                          }
                          required={field === "name"}
                        />
                      </Field.Root>
                    </Box>
                  ))}
                </Grid>
                {items.length > 1 && (
                  <Flex justify="flex-end" mt={3}>
                    <Button onClick={() => removeItem(index)} size="sm" colorScheme="red">
                      <FaTrash /> Eliminar
                    </Button>
                  </Flex>
                )}
              </Box>
            ))}
          </VStack>
        </Card.Body>
      </Card.Root>

      <Button onClick={addItem} colorScheme="blue" size="sm" mt={4}>
        <FaPlus /> Agregar producto
      </Button>
    </>
  );
}
