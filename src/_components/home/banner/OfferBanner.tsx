'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const OfferBanner: React.FC = () => {
    const textRefBanner = useRef<HTMLDivElement>(null);
    const sectionRefBanner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let bannerTrigger: ScrollTrigger | undefined;
    
        if (sectionRefBanner.current && textRefBanner.current) {
            gsap.fromTo(
                textRefBanner.current,
                { text: "" },
                {
                    text: "A partir de una compra mayor a $30.000, el ENVÍO ES GRATIS 🚚",
                    duration: 3,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRefBanner.current,
                        start: "top 80%",
                        once: true,
                        markers: false,
                        onEnter: (self) => {
                            bannerTrigger = self;
                        },
                    },
                }
            );
        }
    
        return () => {
            bannerTrigger?.kill();
        };
    }, []);

    return (
        <Box
        ref={sectionRefBanner}
        bg="black"
        _dark={{ bg: "white", color: "black" }}
        color="white"
        zIndex={1}
        py={2}
        overflow="hidden"
        position="relative"
        width="100%"
        textAlign="center"
    >
        <Text
            ref={textRefBanner}
            fontSize={{ base: "12px", md: "lg", lg: "lg" }}
            fontWeight="bold"
            color={"white"}
            _dark={{ color: "black" }}
            textTransform="uppercase"
        />
    </Box>
    );
};

export default OfferBanner;