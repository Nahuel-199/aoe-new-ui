"use client";

import {
  Box,
  Image,
  Text,
  VStack,
  Badge,
  Card,
  Button,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { getOffers } from "@/lib/actions/product.actions";
import { Product } from "@/types/product.types";

gsap.registerPlugin(ScrollTrigger);

const OfferSlider = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { scale: 4, opacity: 1 },
        {
          scale: 1,
          opacity: 1,
          duration: 3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            end: "bottom top",
            scrub: 1,
            markers: false,
          },
        }
      );
    }
  }, []);

  return (
    <Box w="90%" mx="auto" py={5} mb={6} _dark={{ bg: "black" }}>
      <Box w="100%" overflow="hidden" position="relative">
        <Text
          fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
          color="red.500"
          ref={titleRef}
          textAlign="center"
          mb={6}
        >
          OFERTAS
          <Text as="span" color="black" _dark={{ color: "white" }}>
            {" "}
            ESPECIALES
          </Text>
        </Text>
      </Box>

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
            }}
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="mySwiper"
          >
            {offers.map((product) => (
              <SwiperSlide key={product._id}>
                <VStack
                  overflow="hidden"
                  p={4}
                  w="100%"
                  height="auto"
                  _dark={{ bg: "black" }}
                >
                  <Card.Root maxW="sm" w="90%" overflow="hidden">
                    {product.variants?.[0]?.images?.length ? (
                      <Image
                        src={product.variants[0].images[0].url}
                        alt={product.name}
                        objectFit="cover"
                        h={{ base: "300px", md: "300px", lg: "auto" }}
                      />
                    ) : (
                      <Skeleton height="480px" width="100%" />
                    )}
                    <Card.Body gap="2">
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Description>
                        {product.category?.name} -{" "}
                        {product.subcategories?.map((e) => e.name)}{" "}
                      </Card.Description>
                      <Box display="flex" justifyContent="space-evenly  ">
                        <Badge
                          as="s"
                          fontWeight="medium"
                          letterSpacing="tight"
                          colorPalette="red"
                          fontSize={{ base: "lg" }}
                        >
                          ${product.price}
                        </Badge>
                        <Text
                          fontWeight="medium"
                          letterSpacing="tight"
                          fontSize={{ base: "lg" }}
                        >
                          ${product.price_offer}
                        </Text>
                      </Box>
                    </Card.Body>
                    <Card.Footer gap="2">
                      <Button
                        variant="solid"
                        w={"full"}
                        onClick={() => router.push(`/products/${product._id}`)}
                      >
                        Ver mas
                      </Button>
                    </Card.Footer>
                  </Card.Root>
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
