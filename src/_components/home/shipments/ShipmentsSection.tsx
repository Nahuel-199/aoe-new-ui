'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Text, Heading, Stack, Image } from '@chakra-ui/react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ShipmentsSection: React.FC = () => {
    const servicesRef = useRef<HTMLDivElement[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sectionRef.current) {

            gsap.utils.toArray(servicesRef.current).forEach((el: any) => {
                gsap.fromTo(
                    el,
                    {
                        opacity: 0,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        stagger: 0.3,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 80%',
                            end: 'top 30%',
                            scrub: 1,
                            markers: false,
                        }
                    }
                );
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <Box
            as="section"
            py={10} px={5}
            bg="white"
            _dark={{ bg: 'black' }}
            textAlign="center"
            ref={sectionRef}
            position="relative"
            minH="70vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            zIndex={1}
        >
            <Stack
                align="center"
                justify="center"
                flexDirection={{ base: 'column', md: 'row' }}
                gap={6}
                zIndex={6}
            >
                {[{
                    title: '¿Cómo enviamos tu pedido?',
                    description: 'Correo Argentino, ideal para envíos a todo el país.',
                    icon: "/delivery.png",
                },
                {
                    title: '¿Hay otro método más rápido?',
                    description: 'Sí, también trabajamos con moto envío, un servicio rápido y seguro dentro de la ciudad.',
                    icon: "/moto.png",
                },
                {
                    title: 'Sobre el costo de envío',
                    description: 'Cotizamos el envío al momento de la compra según tu localidad.',
                    icon: "/salary.png",
                }].map((service, index) => (
                    <Box
                        key={index}
                        ref={(el: HTMLDivElement) => (servicesRef.current[index] = el)}
                        opacity={0}
                        textAlign="center"
                        border="1px solid rgba(255, 255, 255, 0.222)"
                        borderRadius="lg"
                        p={6}
                        boxShadow="lg"
                        width={{ base: '100%', md: '300px' }}
                        h={{base: "30vh", md: "auto"}}
                        bg="rgba(255, 255, 255, 0.074)"
                        backdropFilter="blur(20px)"
                        _hover={{
                            boxShadow: '0px 0px 20px 1px rgba(255, 187, 118, 0.3)',
                            borderColor: 'rgba(255, 255, 255, 0.454)',
                            cursor: 'pointer',
                        }}
                        transition="all 0.3s ease"
                    >
                        <Box mb={4} display="flex" justifyContent="center" color="black" _dark={{ color: 'white' }}>
                        <Image src={service.icon} alt={service.title} boxSize="60px" />
                        </Box>
                        <Heading size="md" color="red.600" fontWeight="bold" mb={4} textTransform="uppercase">
                            {service.title}
                        </Heading>
                        <Text fontSize="md" color="black" _dark={{ color: 'white' }}>
                            {service.description}
                        </Text>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default ShipmentsSection;