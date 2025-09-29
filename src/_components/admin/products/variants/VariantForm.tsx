"use client";

import {
  Box,
  HStack,
  Input,
  IconButton,
  Text,
  NumberInput,
  Image,
  Field,
  Button,
  createListCollection,
  Select,
  Portal,
  RadioGroup,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

export const VariantForm = ({
  variant,
  index,
  updateVariant,
  addSizeToVariant,
  handleUploadImage,
  handleRemoveImage,
}: any) => {
  const colors = createListCollection({
    items: [
      { label: "Blanco", value: "Blanco" },
      { label: "Negro", value: "Negro" },
      { label: "Rojo", value: "Rojo" },
      { label: "Azul", value: "Azul" },
      { label: "Verde", value: "Verde" },
      { label: "Vison", value: "Vison" },
      { label: "Bordo", value: "Bordo" },
      { label: "Gris", value: "Gris" },
      { label: "Natural", value: "Natural" },
      { label: "Verde oliva", value: "Verde oliva" },
      { label: "Azul francia", value: "Azul francia" },
      { label: "Beige", value: "Beige" },
      { label: "Gris topo", value: "Gris topo" },
      { label: "Rosa", value: "Rosa" },
    ],
  });

  const typesCollection = createListCollection({
    items: [
      { label: "Basica", value: "Basica" },
      { label: "Oversize", value: "Oversize" },
      { label: "Niños", value: "Niños" },
      { label: "Cuello redondo", value: "Cuello redondo" },
      { label: "Canguro", value: "Canguro" },
      { label: "Cuello redondo niño", value: "Cuello redondo niño" },
      { label: "Canguro niño", value: "Canguro niño" },
    ],
  });

  return (
    <Box p={4} h={"auto"} w="full" maxW={{ base: "95%", md: "100%" }}>
      <Field.Root required>
        <Field.Label>Precio</Field.Label>
        <NumberInput.Root
          min={0}
          value={variant.price}
          onValueChange={(e) => updateVariant(index, "price", e.value)}
          w="full"
          mb={4}
        >
          <NumberInput.Control />
          <NumberInput.Input placeholder="Precio" />
        </NumberInput.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>¿Está en oferta?</Field.Label>
        <RadioGroup.Root
          value={variant.is_offer ? "yes" : "no"}
          onValueChange={(e) =>
            updateVariant(index, "is_offer", e.value === "yes")
          }
          mb={4}
        >
          <HStack gap="6">
            <RadioGroup.Item value="yes">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Sí</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="no">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>No</RadioGroup.ItemText>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>
      </Field.Root>

      {variant.is_offer && (
        <Field.Root>
          <Field.Label>Precio de oferta</Field.Label>
          <NumberInput.Root
            min={0}
            value={variant.price_offer || ""}
            onValueChange={(e) => updateVariant(index, "price_offer", e.value)}
            w="full"
            mb={4}
          >
            <NumberInput.Control />
            <NumberInput.Input placeholder="Precio de oferta" />
          </NumberInput.Root>
        </Field.Root>
      )}

      <Field.Root required>
        <Field.Label>Tipo</Field.Label>
        <Select.Root
          collection={typesCollection}
          value={variant.type ? [variant.type] : []}
          onValueChange={(e) => updateVariant(index, "type", e.value[0])}
          mb={4}
          w="full"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Selecciona tipo de variante" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {typesCollection.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Color</Field.Label>
        <Select.Root
          collection={colors}
          value={variant.color ? [variant.color] : []}
          onValueChange={(e) => updateVariant(index, "color", e.value[0])}
          mb={4}
          w={"full"}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Selecciona un color" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {colors.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>

      <Field.Root required>
        <Field.Label>Imagenes</Field.Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files ? Array.from(e.target.files) : [];
            handleUploadImage(index, files);
          }}
          mb={4}
        />
      </Field.Root>
      <HStack gap={2} wrap="wrap" mb={2}>
        {variant.images?.map((img: any, imgIndex: number) => (
          <Box key={`${img.id}-${imgIndex}`} position="relative">
            <Image
              src={img.url}
              alt={`variant-${index}-${imgIndex}`}
              boxSize="100px"
              objectFit="cover"
              borderRadius="md"
            />
            <IconButton
              aria-label="Eliminar"
              size="xs"
              position="absolute"
              top="2px"
              right="2px"
              onClick={() => handleRemoveImage(index, imgIndex)}
            >
              <IoClose />
            </IconButton>
          </Box>
        ))}
      </HStack>

      {/* <Box maxH={{ base: "100px", lg: "200px" }} overflowY="auto" pr={2}> */}
        {variant.sizes.map((s: any, si: number) => (
          <HStack key={si} gap={4} mb={2} align="end">
            <Box w={{ base: "160px", lg: "200px" }}>
              <Field.Root required>
                <Field.Label>Talle</Field.Label>
                <Input
                  placeholder="Talle"
                  value={s.size}
                  w={"100%"}
                  onChange={(e) => {
                    updateVariant(index, "sizes", [
                      ...variant.sizes.map((sz: any, i: number) =>
                        i === si ? { ...sz, size: e.target.value } : sz
                      ),
                    ]);
                  }}
                />
              </Field.Root>
            </Box>
            <Box w="100px">
              <Field.Root required>
                <Field.Label>Stock</Field.Label>
                <NumberInput.Root
                  min={0}
                  w="100%"
                  value={s.stock.toString()}
                  onValueChange={(e) => {
                    updateVariant(index, "sizes", [
                      ...variant.sizes.map((sz: any, i: number) =>
                        i === si ? { ...sz, stock: Number(e.value) } : sz
                      ),
                    ]);
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input placeholder="Stock" />
                </NumberInput.Root>
              </Field.Root>
            </Box>

            {si === variant.sizes.length - 1 && (
              <Button size="sm" onClick={() => addSizeToVariant(index)}>
                <FiPlus />
              </Button>
            )}
          </HStack>
        ))}
      {/* </Box> */}
    </Box>
  );
};
