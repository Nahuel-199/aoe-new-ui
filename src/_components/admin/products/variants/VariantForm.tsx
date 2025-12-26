"use client";

import {
  Box,
  HStack,
  Input,
  IconButton,
  NumberInput,
  Image,
  Field,
  Button,
  createListCollection,
  Select,
  Portal,
  RadioGroup,
  Text,
  Progress,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { LuTrash2 } from "react-icons/lu";
import { sizeChartUrls } from "@/utils/sizeChartUrls";

export const VariantForm = ({
  variant,
  index,
  updateVariant,
  removeVariant,
  addSizeToVariant,
  removeSizeFromVariant,
  handleUploadImage,
  handleRemoveImage,
  isUploadingImage,
  totalVariants,
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
    <VStack gap={6} align="stretch">
      {/* Delete Variant Button */}
      {totalVariants > 1 && (
        <HStack justify="flex-end">
          <Button
            size="sm"
            colorPalette="red"
            variant="outline"
            onClick={() => removeVariant(index)}
          >
            <LuTrash2 /> Eliminar Variante
          </Button>
        </HStack>
      )}

      {/* Precios */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
        <GridItem>
          <Field.Root required>
            <Field.Label>Precio</Field.Label>
            <NumberInput.Root
              min={0}
              value={variant.price}
              onValueChange={(e) => updateVariant(index, "price", e.value)}
            >
              <NumberInput.Control />
              <NumberInput.Input placeholder="Precio" />
            </NumberInput.Root>
          </Field.Root>
        </GridItem>

        <GridItem>
          <Field.Root>
            <Field.Label>¿En oferta?</Field.Label>
            <RadioGroup.Root
              value={variant.is_offer ? "yes" : "no"}
              onValueChange={(e) =>
                updateVariant(index, "is_offer", e.value === "yes")
              }
            >
              <HStack gap="4" h="40px" align="center">
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
        </GridItem>

        {variant.is_offer && (
          <GridItem>
            <Field.Root>
              <Field.Label>Precio de oferta</Field.Label>
              <NumberInput.Root
                min={0}
                value={variant.price_offer || ""}
                onValueChange={(e) => updateVariant(index, "price_offer", e.value)}
              >
                <NumberInput.Control />
                <NumberInput.Input placeholder="Precio de oferta" />
              </NumberInput.Root>
            </Field.Root>
          </GridItem>
        )}
      </Grid>

      {/* Tipo y Color */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <GridItem>
          <Field.Root required>
            <Field.Label>Tipo</Field.Label>
            <Select.Root
              collection={typesCollection}
              value={variant.type ? [variant.type] : []}
              onValueChange={(e) => {
                updateVariant(index, "type", e.value[0])
                const sizeChart = sizeChartUrls[e.value[0]] || null;
                updateVariant(index, "size_chart", sizeChart);
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Selecciona tipo" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
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
            </Select.Root>
          </Field.Root>
        </GridItem>

        <GridItem>
          <Field.Root required>
            <Field.Label>Color</Field.Label>
            <Select.Root
              collection={colors}
              value={variant.color ? [variant.color] : []}
              onValueChange={(e) => updateVariant(index, "color", e.value[0])}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Selecciona color" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
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
            </Select.Root>
          </Field.Root>
        </GridItem>
      </Grid>

      {/* Imágenes */}
      <Box>
        <Field.Root required>
          <Field.Label>Imágenes</Field.Label>
          {isUploadingImage ? (
            <Box
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
              bg="bg.muted"
            >
              <Text mb={2} fontSize="sm" color="gray.600">
                Subiendo imágenes...
              </Text>
              <Progress.Root value={60} colorPalette="red" variant="subtle">
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>
          ) : (
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                handleUploadImage(index, files);
              }}
            />
          )}
        </Field.Root>

        {variant.images?.length > 0 && (
          <HStack gap={3} wrap="wrap" mt={4}>
            {variant.images.map((img: any, imgIndex: number) => (
              <Box key={`${img.id}-${imgIndex}`} position="relative">
                <Image
                  src={img.url}
                  alt={`variant-${index}-${imgIndex}`}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                />
                <IconButton
                  aria-label="Eliminar imagen"
                  size="xs"
                  colorPalette="red"
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  onClick={() => handleRemoveImage(index, imgIndex)}
                  borderRadius="full"
                >
                  <IoClose />
                </IconButton>
              </Box>
            ))}
          </HStack>
        )}
      </Box>

      {/* Talles y Stock */}
      <Box>
        <HStack justify="space-between" mb={3}>
          <Text fontWeight="semibold">Talles y Stock</Text>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={() => addSizeToVariant(index)}
          >
            <FiPlus /> Agregar Talle
          </Button>
        </HStack>

        <VStack gap={3} align="stretch">
          {variant.sizes.map((s: any, si: number) => (
            <HStack key={si} gap={3} align="end">
              <Grid
                flex="1"
                templateColumns={{ base: "1fr 1fr", md: "2fr 1fr" }}
                gap={3}
              >
                <GridItem>
                  <Field.Root required>
                    <Field.Label>Talle</Field.Label>
                    <Input
                      placeholder="Ej: S, M, L, XL"
                      value={s.size}
                      onChange={(e) => {
                        updateVariant(index, "sizes", [
                          ...variant.sizes.map((sz: any, i: number) =>
                            i === si ? { ...sz, size: e.target.value } : sz
                          ),
                        ]);
                      }}
                    />
                  </Field.Root>
                </GridItem>

                <GridItem>
                  <Field.Root required>
                    <Field.Label>Stock</Field.Label>
                    <NumberInput.Root
                      min={0}
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
                      <NumberInput.Input placeholder="0" />
                    </NumberInput.Root>
                  </Field.Root>
                </GridItem>
              </Grid>

              {variant.sizes.length > 1 && (
                <IconButton
                  aria-label="Eliminar talle"
                  colorPalette="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSizeFromVariant(index, si)}
                >
                  <LuTrash2 />
                </IconButton>
              )}
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
