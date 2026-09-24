"use client";

import { Box, Grid, Input, NativeSelect, Skeleton, Text, Textarea } from "@chakra-ui/react";
import { useProductForm } from "@/hooks/useProductForm";
import { Category, Product, Subcategory } from "@/types/product.types";
import { colorMap } from "@/_components/products/utils/ColorMaps";
import { cldThumb } from "@/utils/cloudinaryImage";

interface ProductFormScreenProps {
  product?: Product;
  categories: Category[];
  subcategories: Subcategory[];
  onCancel: () => void;
  onSaved: () => void;
  isDesktop?: boolean;
}

const VARIANT_TYPES = ["Básica", "Oversize"];
const VARIANT_COLORS = Object.keys(colorMap);

const fieldLabelProps = {
  fontSize: "12px",
  fontWeight: "700" as const,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "#d4d4d4",
};

const inputStyle = {
  h: "52px",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "aoe.borderControl",
  bg: "aoe.bg",
  color: "aoe.text",
  fontSize: "16px",
};

export default function ProductFormScreen({
  product,
  categories,
  subcategories,
  onCancel,
  onSaved,
  isDesktop = false,
}: ProductFormScreenProps) {
  const mode = product ? "edit" : "create";
  const {
    form,
    handleChange,
    handleCategory,
    handleSubcategories,
    addVariant,
    removeVariant,
    updateVariant,
    addSizeToVariant,
    removeSizeFromVariant,
    handleUploadImage,
    handleRemoveImage,
    moveImage,
    handleSubmit,
    isLoading,
    uploadingCounts,
  } = useProductForm({ mode, product, onClose: onSaved });

  const toggleSubcategory = (id: string) => {
    const next = form.subcategories.includes(id)
      ? form.subcategories.filter((s) => s !== id)
      : [...form.subcategories, id];
    handleSubcategories(next);
  };

  return (
    <Box pb="16px">
      <Box
        as="button"
        onClick={onCancel}
        bg="transparent"
        border="none"
        color="aoe.textMuted"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.12em"
        textTransform="uppercase"
        p={0}
        mb="16px"
      >
        ← Cancelar
      </Box>

      <Box border="1px solid" borderColor="aoe.borderSubtle" bg="aoe.tile" borderRadius="18px" p="16px">
        <Text fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="aoe.textSubtle" mb="14px">
          01 · Información básica
        </Text>
        <Box display="grid" gap="14px">
          <Box display="grid" gap="7px">
            <Text {...fieldLabelProps}>Nombre</Text>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Ej: Remera Kokushibo 03" {...inputStyle} />
          </Box>
          <Box display="grid" gap="7px">
            <Text {...fieldLabelProps}>Descripción</Text>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Algodón peinado 24/1, estampa serigráfica…"
              borderRadius="12px"
              border="1px solid"
              borderColor="aoe.borderControl"
              bg="aoe.bg"
              color="aoe.text"
              fontSize="16px"
              resize="vertical"
            />
          </Box>
          <Box display="grid" gap="7px">
            <Text {...fieldLabelProps}>Categoría</Text>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={form.category[0] || ""}
                onChange={(e) => handleCategory(e.target.value ? [e.target.value] : [])}
                {...inputStyle}
                px="12px"
              >
                <option value="">Elegí una categoría</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
          <Box display="grid" gap="7px">
            <Text {...fieldLabelProps}>Subcategorías</Text>
            <Grid templateColumns="repeat(2, 1fr)" gap="8px">
              {subcategories.map((s) => (
                <Box key={s._id} as="label" display="flex" alignItems="center" gap="8px" fontSize="14px" color="aoe.text">
                  <input
                    type="checkbox"
                    checked={form.subcategories.includes(s._id)}
                    onChange={() => toggleSubcategory(s._id)}
                    style={{ width: 16, height: 16 }}
                  />
                  {s.name}
                </Box>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      <Box border="1px solid" borderColor="aoe.borderSubtle" bg="aoe.tile" borderRadius="18px" p="16px" mt="12px">
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="10px" mb="14px">
          <Text fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" color="aoe.textSubtle">
            02 · Variantes
          </Text>
          <Box
            as="button"
            onClick={addVariant}
            h="38px"
            px="14px"
            borderRadius="11px"
            border="1px solid"
            borderColor="aoe.red"
            bg="transparent"
            color="aoe.red"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            + Agregar
          </Box>
        </Box>

        <Box display="grid" gap="10px">
          {form.variants.map((v, index) => (
            <Box key={index} border="1px solid" borderColor="aoe.borderSubtle" borderRadius="14px" bg="aoe.bg" p="14px">
              <Box display="flex" justifyContent="space-between" alignItems="center" gap="10px">
                <Text fontSize="14px" fontWeight="800" letterSpacing="0.04em" textTransform="uppercase" color="aoe.text">
                  Variante #{index + 1}
                </Text>
                <Box
                  as="button"
                  onClick={() => removeVariant(index)}
                  w="34px"
                  h="34px"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor="#3d1519"
                  bg="#150a0c"
                  color="#ff6b76"
                  fontSize="13px"
                >
                  ✕
                </Box>
              </Box>

              <Grid templateColumns="repeat(auto-fit, minmax(130px, 1fr))" gap="10px" mt="12px">
                <Box display="grid" gap="6px">
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Tipo
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={v.type}
                      onChange={(e) => updateVariant(index, "type", e.target.value)}
                      h="48px"
                      borderRadius="11px"
                      border="1px solid"
                      borderColor="aoe.borderControl"
                      bg="aoe.tile"
                      color="aoe.text"
                      fontSize="15px"
                      px="12px"
                    >
                      <option value="">Elegí un tipo</option>
                      {[...new Set([...VARIANT_TYPES, ...(v.type ? [v.type] : [])])].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                <Box display="grid" gap="6px">
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Color
                  </Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={v.color}
                      onChange={(e) => updateVariant(index, "color", e.target.value)}
                      h="48px"
                      borderRadius="11px"
                      border="1px solid"
                      borderColor="aoe.borderControl"
                      bg="aoe.tile"
                      color="aoe.text"
                      fontSize="15px"
                      px="12px"
                    >
                      <option value="">Elegí un color</option>
                      {[...new Set([...VARIANT_COLORS, ...(v.color ? [v.color] : [])])].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                <Box display="grid" gap="6px">
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Precio
                  </Text>
                  <Input
                    inputMode="numeric"
                    value={v.price}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                    placeholder="24000"
                    h="48px"
                    borderRadius="11px"
                    border="1px solid"
                    borderColor="aoe.borderControl"
                    bg="aoe.tile"
                    color="aoe.text"
                    fontSize="15px"
                  />
                </Box>
                <Box display="grid" gap="6px">
                  <Text fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.12em" textTransform="uppercase">
                    Precio oferta
                  </Text>
                  <Input
                    inputMode="numeric"
                    value={v.price_offer}
                    onChange={(e) => updateVariant(index, "price_offer", e.target.value)}
                    placeholder="Opcional"
                    h="48px"
                    borderRadius="11px"
                    border="1px solid"
                    borderColor="aoe.borderControl"
                    bg="aoe.tile"
                    color="aoe.text"
                    fontSize="15px"
                  />
                </Box>
              </Grid>

              <Box as="label" display="flex" alignItems="center" gap="8px" fontSize="13px" color="aoe.text" mt="12px">
                <input
                  type="checkbox"
                  checked={v.is_offer}
                  onChange={(e) => updateVariant(index, "is_offer", e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Marcar como oferta
              </Box>

              <Box mt="14px">
                <Text
                  fontFamily="mono"
                  fontSize="11px"
                  color="aoe.textMuted"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  mb="8px"
                >
                  Fotos
                </Text>
                <Grid templateColumns="repeat(auto-fill, minmax(90px, 1fr))" gap="8px">
                  {v.images.map((img, imgIdx) => (
                    <Box key={img.id} position="relative" aspectRatio="4 / 5" borderRadius="10px" overflow="hidden" bg="aoe.tile">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img {...cldThumb(img.url, 120)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      {imgIdx === 0 && (
                        <Box
                          position="absolute"
                          bottom="4px"
                          left="4px"
                          px="6px"
                          py="2px"
                          borderRadius="6px"
                          bg="rgba(0,0,0,0.7)"
                          color="white"
                          fontSize="9px"
                          fontWeight="700"
                          letterSpacing="0.06em"
                          textTransform="uppercase"
                        >
                          Principal
                        </Box>
                      )}
                      <Box
                        as="button"
                        onClick={() => handleRemoveImage(index, imgIdx)}
                        position="absolute"
                        top="4px"
                        right="4px"
                        w="22px"
                        h="22px"
                        borderRadius="pill"
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        fontSize="11px"
                        border="none"
                      >
                        ✕
                      </Box>
                      <Box position="absolute" bottom="4px" right="4px" display="flex" gap="4px">
                        <Box
                          as="button"
                          onClick={() => moveImage(index, imgIdx, "left")}
                          w="22px"
                          h="22px"
                          borderRadius="pill"
                          bg="rgba(0,0,0,0.7)"
                          color="white"
                          fontSize="11px"
                          border="none"
                          opacity={imgIdx === 0 ? 0.35 : 1}
                          cursor={imgIdx === 0 ? "default" : "pointer"}
                        >
                          ‹
                        </Box>
                        <Box
                          as="button"
                          onClick={() => moveImage(index, imgIdx, "right")}
                          w="22px"
                          h="22px"
                          borderRadius="pill"
                          bg="rgba(0,0,0,0.7)"
                          color="white"
                          fontSize="11px"
                          border="none"
                          opacity={imgIdx === v.images.length - 1 ? 0.35 : 1}
                          cursor={imgIdx === v.images.length - 1 ? "default" : "pointer"}
                        >
                          ›
                        </Box>
                      </Box>
                    </Box>
                  ))}
                  {Array.from({ length: uploadingCounts[index] || 0 }).map((_, skeletonIdx) => (
                    <Skeleton key={`uploading-${skeletonIdx}`} aspectRatio="4 / 5" borderRadius="10px" />
                  ))}
                  <Box as="label" aspectRatio="4 / 5" borderRadius="10px" border="1px dashed" borderColor="aoe.borderHover" display="grid" placeItems="center" color="aoe.textMuted" fontSize="22px" cursor="pointer">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleUploadImage(index, files);
                        e.target.value = "";
                      }}
                    />
                  </Box>
                </Grid>
              </Box>

              <Box mt="14px">
                <Text
                  fontFamily="mono"
                  fontSize="11px"
                  color="aoe.textMuted"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  mb="8px"
                >
                  Stock por talle
                </Text>
                <Box display="grid" gap="8px">
                  {v.sizes.map((sz, szIdx) => (
                    <Box key={szIdx} display="grid" gridTemplateColumns="1fr 1fr auto" gap="8px" alignItems="center">
                      <Input
                        value={sz.size}
                        onChange={(e) => {
                          const sizes = [...v.sizes];
                          sizes[szIdx] = { ...sizes[szIdx], size: e.target.value };
                          updateVariant(index, "sizes", sizes);
                        }}
                        placeholder="Talle"
                        h="44px"
                        borderRadius="10px"
                        border="1px solid"
                        borderColor="aoe.borderControl"
                        bg="aoe.tile"
                        color="aoe.text"
                        fontSize="14px"
                        textAlign="center"
                      />
                      <Input
                        inputMode="numeric"
                        value={sz.stock}
                        onChange={(e) => {
                          const sizes = [...v.sizes];
                          sizes[szIdx] = { ...sizes[szIdx], stock: Number(e.target.value) || 0 };
                          updateVariant(index, "sizes", sizes);
                        }}
                        placeholder="Stock"
                        h="44px"
                        borderRadius="10px"
                        border="1px solid"
                        borderColor="aoe.borderControl"
                        bg="aoe.tile"
                        color="aoe.text"
                        fontSize="14px"
                        textAlign="center"
                      />
                      <Box
                        as="button"
                        onClick={() => removeSizeFromVariant(index, szIdx)}
                        w="36px"
                        h="36px"
                        borderRadius="10px"
                        border="1px solid"
                        borderColor="#3d1519"
                        bg="#150a0c"
                        color="#ff6b76"
                        fontSize="12px"
                      >
                        ✕
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  as="button"
                  onClick={() => addSizeToVariant(index)}
                  mt="8px"
                  h="40px"
                  w="full"
                  borderRadius="10px"
                  border="1px dashed"
                  borderColor="aoe.borderHover"
                  bg="transparent"
                  color="aoe.textMuted"
                  fontSize="12px"
                  fontWeight="700"
                  letterSpacing="0.06em"
                  textTransform="uppercase"
                >
                  + Agregar talle
                </Box>
              </Box>
            </Box>
          ))}

          {form.variants.length === 0 && (
            <Text color="aoe.textSubtle" fontSize="13px" textAlign="center" py={4}>
              Todavía no agregaste ninguna variante.
            </Text>
          )}
        </Box>
      </Box>

      <Box position="fixed" left={0} right={0} bottom={0} zIndex={70} bg="rgba(10,10,10,0.96)" backdropFilter="blur(14px)" borderTop="1px solid" borderColor="aoe.borderSubtle" px={4} py="12px" pb="16px">
        <Box
          maxW={isDesktop ? "1320px" : "760px"}
          mx={isDesktop ? undefined : "auto"}
          ml={isDesktop ? "236px" : undefined}
          display="flex"
          gap="10px"
        >
          <Box
            as="button"
            onClick={onCancel}
            h="54px"
            px="20px"
            borderRadius="14px"
            border="1px solid"
            borderColor="aoe.borderControl"
            bg="aoe.chip"
            color="aoe.text"
            fontSize="12px"
            fontWeight="800"
            letterSpacing="0.08em"
            textTransform="uppercase"
          >
            Cancelar
          </Box>
          <Box
            as="button"
            onClick={() => !isLoading && handleSubmit()}
            flex={1}
            h="54px"
            borderRadius="14px"
            border="none"
            bg="aoe.red"
            color="white"
            fontSize="13px"
            fontWeight="800"
            letterSpacing="0.1em"
            textTransform="uppercase"
            opacity={isLoading ? 0.6 : 1}
          >
            {isLoading ? "Guardando…" : mode === "create" ? "Publicar producto" : "Guardar cambios"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
