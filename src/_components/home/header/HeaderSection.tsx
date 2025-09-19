'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Box, Text } from '@chakra-ui/react';
import 'swiper/css';
import 'swiper/css/pagination';

const HeaderSection: React.FC = () => {
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            titleRef.current,
            { x: '-100vw', opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
        );
    }, []);

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={10}
            height={{ base: '280px', md: 'auto' }}
            w={"100%"}
        >

            <Box ref={titleRef} width="90%" display="flex" flexDirection="column" justifyContent="center">
                <Text
                    fontSize={{ base: '3xl', md: '8xl' }}
                    fontWeight="bold"
                    color="blackAlpha.800"
                    _dark={{ color: 'white' }}
                    mb={4}
                    textAlign={"start"}
                    textTransform={"uppercase"}
                >
                    <Text as="span" color="red.500">¡Bienvenidos</Text> a nuestra tienda de ropa!
                </Text>
                <Text fontSize={{ base: 'md', md: 'xl' }} color="gray.700" _dark={{ color: 'gray.300' }} >
                    Descubre los productos más exclusivos de nuestra tienda, ¡no te lo pierdas!
                </Text>
            </Box>
        </Box>
    );
};

export default HeaderSection;