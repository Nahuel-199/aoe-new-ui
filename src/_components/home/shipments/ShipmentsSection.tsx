'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Text, Grid, Flex } from '@chakra-ui/react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
    { n: '01', title: 'Envíos a todo el país', body: 'Correo Argentino, ideal para envíos a todo el país.' },
    { n: '02', title: 'Moto envío', body: 'Servicio rápido y seguro dentro de CABA y GBA, coordinás por WhatsApp.' },
    { n: '03', title: 'Costo de envío', body: 'Cotizamos el envío al momento de la compra según tu localidad.' },
    { n: '04', title: 'Pagás como querés', body: 'Mercado Pago en cuotas o transferencia.' },
];

const ShipmentsSection: React.FC = () => {
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sectionRef.current) {
            gsap.utils.toArray(itemsRef.current).forEach((el: any) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        stagger: 0.15,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            end: 'top 40%',
                            scrub: 1,
                            markers: false,
                        },
                    }
                );
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <Box as="section" borderBottom="1px solid" borderColor="aoe.borderSubtle" bg="aoe.bgAlt" ref={sectionRef}>
            <Grid
                maxW="1360px"
                mx="auto"
                px={{ base: 4, md: 5 }}
                py="28px"
                templateColumns={{ base: '1fr', sm: 'repeat(auto-fit, minmax(210px, 1fr))' }}
                gap={6}
            >
                {items.map((item, index) => (
                    <Flex
                        key={index}
                        ref={(el: HTMLDivElement) => { itemsRef.current[index] = el; }}
                        opacity={0}
                        gap={3}
                        align="flex-start"
                    >
                        <Text fontFamily="mono" fontSize="11px" color="aoe.red" pt="3px">
                            {item.n}
                        </Text>
                        <Box minW={0}>
                            <Text fontSize="13px" fontWeight="800" letterSpacing="0.06em" textTransform="uppercase" color="aoe.text">
                                {item.title}
                            </Text>
                            <Text color="aoe.textSubtle" fontSize="13px" mt={1} lineHeight="1.45">
                                {item.body}
                            </Text>
                        </Box>
                    </Flex>
                ))}
            </Grid>
        </Box>
    );
};

export default ShipmentsSection;
