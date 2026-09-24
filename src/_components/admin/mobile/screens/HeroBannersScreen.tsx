"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Grid, Image, Input, Skeleton, Text } from "@chakra-ui/react";
import { showToast } from "nextjs-toast-notify";
import { imageUpload } from "@/utils/uploadCloudinary";
import { setHeroBanner, setHeroBannerLink, removeHeroBanner } from "@/lib/actions/heroBanner.actions";
import { HeroBanner } from "@/types/heroBanner.types";
import { cldImage } from "@/utils/cloudinaryImage";

function notify(kind: "success" | "error", message: string) {
  showToast[kind](message, { duration: 3000, progress: true, position: "top-center" });
}

interface HeroBannersScreenProps {
  banners: (HeroBanner | null)[];
  isDesktop?: boolean;
}

export default function HeroBannersScreen({ banners, isDesktop = false }: HeroBannersScreenProps) {
  const router = useRouter();
  // Estado local optimista: la fuente de verdad para lo que se ve en pantalla
  // es esto, no la prop `banners` (que sólo se actualiza cuando el server
  // component vuelve a renderizar tras un `router.refresh()`). Guardar el
  // link dependía antes de esa prop, y si el usuario tocaba el campo justo
  // después de subir una imagen, todavía podía estar desactualizada y tirar
  // "subí una imagen primero" aunque la imagen ya estuviera guardada.
  const [localBanners, setLocalBanners] = useState(banners);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [savingLink, setSavingLink] = useState<Record<number, boolean>>({});
  const [links, setLinks] = useState<Record<number, string>>(
    () => Object.fromEntries(banners.map((b, i) => [i, b?.link || ""]))
  );

  const handleUpload = async (index: number, files: File[]) => {
    if (files.length === 0) return;
    setUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const [uploaded] = await imageUpload(files);
      if (!uploaded) throw new Error("upload failed");

      const banner: HeroBanner = {
        id: uploaded.public_id,
        url: uploaded.url,
        link: links[index] || undefined,
      };
      const result = await setHeroBanner(index, banner);
      notify(result.success ? "success" : "error", result.message);
      if (result.success) {
        setLocalBanners((prev) => {
          const next = [...prev];
          next[index] = banner;
          return next;
        });
        router.refresh();
      }
    } catch {
      notify("error", "No pudimos subir la imagen");
    } finally {
      setUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleRemove = async (index: number) => {
    const result = await removeHeroBanner(index);
    notify(result.success ? "success" : "error", result.message);
    if (result.success) {
      setLocalBanners((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
      setLinks((prev) => ({ ...prev, [index]: "" }));
      router.refresh();
    }
  };

  const handleSaveLink = async (index: number) => {
    setSavingLink((prev) => ({ ...prev, [index]: true }));
    try {
      const result = await setHeroBannerLink(index, links[index]);
      notify(result.success ? "success" : "error", result.message);
      if (result.success) {
        setLocalBanners((prev) => {
          const next = [...prev];
          const current = next[index];
          if (current) next[index] = { ...current, link: links[index] || undefined };
          return next;
        });
        router.refresh();
      }
    } finally {
      setSavingLink((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <Box>
      <Text color="aoe.textSubtle" fontSize="14px" lineHeight="1.5" mb="16px">
        Estas son las 4 fotos grandes que se ven en la portada del sitio. Si dejás un slot
        vacío, se completa automáticamente con un producto en oferta.
      </Text>

      <Grid
        templateColumns={isDesktop ? "repeat(4, 1fr)" : "1fr 1fr"}
        gap="14px"
        maxW={isDesktop ? "1040px" : "480px"}
      >
        {localBanners.map((banner, index) => {
          const linkDirty = (banner?.link || "") !== links[index];
          return (
            <Box key={index} data-slot={index} display="grid" gap="8px">
              <Box
                position="relative"
                aspectRatio="4 / 5"
                borderRadius="14px"
                overflow="hidden"
                bg="aoe.tile"
                border="1px solid"
                borderColor="aoe.borderSubtle"
              >
                {uploading[index] ? (
                  <Skeleton w="100%" h="100%" />
                ) : banner ? (
                  <>
                    <Image {...cldImage(banner.url, { sizes: "50vw", maxWidth: 828 })} alt="" w="100%" h="100%" objectFit="cover" />
                    <Box
                      as="button"
                      aria-label="Quitar imagen"
                      onClick={() => handleRemove(index)}
                      position="absolute"
                      top="8px"
                      right="8px"
                      zIndex={1}
                      w="30px"
                      h="30px"
                      borderRadius="10px"
                      border="1px solid"
                      borderColor="#3d1519"
                      bg="rgba(21,10,12,0.9)"
                      color="#ff6b76"
                      fontSize="13px"
                    >
                      ✕
                    </Box>
                    <Box as="label" position="absolute" inset={0} cursor="pointer">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          handleUpload(index, files);
                          e.target.value = "";
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <Box
                    as="label"
                    position="absolute"
                    inset={0}
                    display="grid"
                    placeItems="center"
                    gap="6px"
                    cursor="pointer"
                    border="1px dashed"
                    borderColor="aoe.borderHover"
                    borderRadius="14px"
                    color="aoe.textMuted"
                  >
                    <Text fontSize="22px" lineHeight="1">
                      +
                    </Text>
                    <Text fontSize="11px" fontFamily="mono" textTransform="uppercase" letterSpacing="0.06em">
                      Slot {index + 1}
                    </Text>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleUpload(index, files);
                        e.target.value = "";
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Flex gap="6px">
                <Input
                  value={links[index]}
                  onChange={(e) => setLinks((prev) => ({ ...prev, [index]: e.target.value }))}
                  placeholder="/products?category=Ofertas"
                  h="38px"
                  flex={1}
                  minW={0}
                  borderRadius="9px"
                  border="1px solid"
                  borderColor="aoe.borderControl"
                  bg="aoe.chip"
                  color="aoe.text"
                  fontSize="12px"
                  px="10px"
                />
                <Box
                  as="button"
                  onClick={() => {
                    if (!banner || !linkDirty || savingLink[index]) return;
                    handleSaveLink(index);
                  }}
                  h="38px"
                  px="12px"
                  flexShrink={0}
                  borderRadius="9px"
                  border="1px solid"
                  borderColor={banner && linkDirty ? "aoe.red" : "aoe.borderControl"}
                  bg="transparent"
                  color={banner && linkDirty ? "aoe.red" : "aoe.textDisabled"}
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  cursor={banner && linkDirty ? "pointer" : "default"}
                  opacity={savingLink[index] ? 0.6 : 1}
                >
                  Guardar
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}
