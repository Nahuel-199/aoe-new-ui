'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { Box, Text, Grid, Image, Button, Flex } from '@chakra-ui/react';
import { Product } from '@/types/product.types';
import { HeroBanner } from '@/types/heroBanner.types';

interface HeaderSectionProps {
    offers: Product[];
    heroBanners?: (HeroBanner | null)[];
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ offers, heroBanners = [] }) => {
    const titleRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const shots = offers.slice(0, 4);

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { x: '-100vw', opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
        );
    }, []);

    return (
        <Box
            position="relative"
            borderBottom="1px solid"
            borderColor="aoe.borderSubtle"
            bgGradient="radial-gradient(1200px 500px at 15% 0%, #141414 0%, #0a0a0a 70%)"
        >
            <Grid
                maxW="1360px"
                mx="auto"
                px={{ base: 4, md: 5 }}
                py={{ base: '48px', md: '56px 20px 64px' }}
                templateColumns={{ base: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' }}
                gap={10}
                alignItems="start"
            >
                <Box ref={titleRef} minW={0}>
                    <Flex
                        align="center"
                        gap={2}
                        border="1px solid"
                        borderColor="aoe.borderControl"
                        borderRadius="pill"
                        px="12px"
                        py="6px"
                        display="inline-flex"
                        fontFamily="mono"
                        fontSize="10px"
                        letterSpacing="0.16em"
                        color="aoe.textMuted"
                        textTransform="uppercase"
                        mb={6}
                    >
                        <Box w="6px" h="6px" borderRadius="pill" bg="aoe.red" />
                        Drops nuevos cada semana
                    </Flex>

                    <Text
                        fontFamily="heading"
                        fontSize="clamp(32px, 6vw, 76px)"
                        lineHeight="0.92"
                        margin={0}
                        textTransform="uppercase"
                        letterSpacing="-0.01em"
                        wordBreak="keep-all"
                        color="aoe.text"
                    >
                        Usá lo<br />que te<br /><Text as="span" color="aoe.red">representa</Text>
                    </Text>

                    <Text maxW="440px" mt={6} color="aoe.textMuted" fontSize="17px" lineHeight="1.55">
                        Remeras y buzos de anime, rock y series. Estampas propias, algodón peinado y talles reales.
                    </Text>

                    <Flex flexWrap="wrap" gap={3} mt={8}>
                        <Button
                            h="54px"
                            px="30px"
                            border="none"
                            borderRadius="pill"
                            bg="aoe.red"
                            color="white"
                            fontFamily="mono"
                            fontSize="14px"
                            fontWeight="800"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            _hover={{ bg: 'aoe.text', color: 'aoe.bg' }}
                            onClick={() => router.push('/products')}
                        >
                            Ver catálogo
                        </Button>
                        <Button
                            h="54px"
                            px="30px"
                            border="1px solid"
                            borderColor="aoe.borderControl"
                            borderRadius="pill"
                            bg="transparent"
                            color="aoe.text"
                            fontFamily="mono"
                            fontSize="14px"
                            fontWeight="800"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            _hover={{ borderColor: 'aoe.text' }}
                            onClick={() => router.push('/products?category=Ofertas')}
                        >
                            Ofertas
                        </Button>
                    </Flex>

                    <Flex gap={7} mt={10} fontFamily="mono" fontSize="11px" color="aoe.textMuted" letterSpacing="0.08em" flexWrap="wrap">
                        <Text>Hecho en Argentina</Text>
                    </Flex>
                </Box>

                <Grid templateColumns="1fr 1fr" gap="14px" minW={0}>
                    {Array.from({ length: 4 }).map((_, i) => {
                        const banner = heroBanners[i];
                        const product = shots[i];
                        const img = banner?.url || product?.variants?.[0]?.images?.[0]?.url;
                        // Si hay una imagen curada en este slot, el link es el que se le
                        // asignó a ELLA (o ninguno) — nunca el del producto que ocupaba
                        // el slot antes de que se subiera esta imagen.
                        const href = banner ? banner.link || undefined : product ? `/products/${product._id}` : undefined;
                        return (
                            <Box
                                key={banner?.id ?? product?._id ?? i}
                                as="button"
                                position="relative"
                                bg="aoe.tile"
                                borderRadius="18px"
                                overflow="hidden"
                                aspectRatio="4 / 5"
                                border="none"
                                p={0}
                                cursor={href ? 'pointer' : 'default'}
                                _hover={href ? { outline: '2px solid', outlineColor: 'aoe.red' } : undefined}
                                onClick={() => href && router.push(href)}
                            >
                                {img && (
                                    <Image src={img} alt={banner ? '' : product?.name} w="100%" h="100%" objectFit="cover" />
                                )}
                            </Box>
                        );
                    })}
                </Grid>
            </Grid>
        </Box>
    );
};

export default HeaderSection;
