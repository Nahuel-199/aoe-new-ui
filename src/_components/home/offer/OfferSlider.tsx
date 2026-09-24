"use client";

import {
  Box,
  Image,
  Text,
  VStack,
  Badge,
  Button,
  Stack,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOffers } from "@/lib/actions/product.actions";
import { Product } from "@/types/product.types";
import { cldImage } from "@/utils/cloudinaryImage";

interface OfferSliderProps {
  title?: string;
  /** Ofertas ya cargadas por el padre (ej. home). Si no se pasan, el componente hace su propio fetch (ej. uso en la PDP). */
  offers?: Product[];
}

const OfferSlider = ({ title, offers: providedOffers }: OfferSliderProps) => {
  const [fetchedOffers, setFetchedOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(providedOffers === undefined);
  const router = useRouter();
  const offers = providedOffers ?? fetchedOffers;

  useEffect(() => {
    if (providedOffers !== undefined) return;

    const fetchData = async () => {
      try {
        const data = await getOffers();
        setFetchedOffers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box as="section" maxW="1360px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 10, md: "56px" }}>
      <Text
        fontFamily="heading"
        fontSize={{ base: "28px", md: "clamp(28px, 4vw, 44px)" }}
        textTransform="uppercase"
        color="aoe.text"
        mb="22px"
      >
        {title ? (
          title
        ) : (
          <>
            Ofertas <Text as="span" color="aoe.red">especiales</Text>
          </>
        )}
      </Text>

      {loading ? (
        <Stack
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-around"}
          gap={4}
          mb={6}
        >
          <Skeleton height="300px" />
          <Skeleton height="300px" />
          <Skeleton height="300px" />
        </Stack>
      ) : (
        <Box transition="opacity 1s ease-in-out">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="mySwiper"
          >
            {offers.map((product) => (
              <SwiperSlide key={product._id}>
                <VStack overflow="hidden" p={4} w="100%" height="auto">
                  <Box
                    w="90%"
                    bg="aoe.surface"
                    borderRadius="16px"
                    overflow="hidden"
                    position="relative"
                  >
                    {product.variants?.[0]?.images?.length ? (
                      <Box position="relative" aspectRatio="4 / 5">
                        <Image
                          {...cldImage(product.variants[0].images[0].url, {
                            sizes:
                              "(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw",
                            maxWidth: 828,
                          })}
                          alt={product.name}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                        <Badge
                          position="absolute"
                          top="10px"
                          left="10px"
                          bg="aoe.red"
                          color="white"
                          borderRadius="6px"
                          px="8px"
                          py="4px"
                          fontFamily="mono"
                          fontSize="10px"
                          fontWeight="700"
                        >
                          OFERTA
                        </Badge>
                      </Box>
                    ) : (
                      <Skeleton height="320px" width="100%" />
                    )}
                    <Box p="14px">
                      <Text fontSize="14px" fontWeight="700" color="aoe.text">
                        {product.name}
                      </Text>
                      <Text
                        fontFamily="mono"
                        fontSize="10px"
                        color="aoe.textFaint"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        mt="5px"
                      >
                        {product.category?.name} ·{" "}
                        {product.subcategories?.map((e) => e.name).join(", ")}
                      </Text>
                      <Flex gap="8px" align="baseline" mt="8px">
                        <Text
                          as="s"
                          color="aoe.textGhost"
                          fontSize="12px"
                        >
                          ${product.variants.map((v) => v.price)[0]}
                        </Text>
                        <Text fontWeight="800" fontSize="14px" color="aoe.text">
                          ${product.variants.map((v) => v.price_offer)[0]}
                        </Text>
                      </Flex>
                      <Button
                        mt="12px"
                        w="full"
                        h="42px"
                        borderRadius="pill"
                        bg="aoe.red"
                        color="white"
                        fontFamily="mono"
                        fontSize="11px"
                        fontWeight="800"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        border="none"
                        _hover={{ bg: "aoe.text", color: "aoe.bg" }}
                        onClick={() => router.push(`/products/${product._id}`)}
                      >
                        Ver más
                      </Button>
                    </Box>
                  </Box>
                </VStack>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default OfferSlider;
