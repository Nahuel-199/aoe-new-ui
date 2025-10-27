"use client";

import { useEffect, useRef } from "react";
import { Box, Heading, Text, SimpleGrid, VStack, HStack, Button, Image, Avatar, Card, CardBody, Flex } from "@chakra-ui/react";
import { FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
    "/personalizados/p1.jpg",
    "/personalizados/p2.jpg",
    "/personalizados/p3.jpg",
    "/personalizados/p4.jpg",
    "/personalizados/p5.jpg",
    "/personalizados/p6.jpg",
    "/personalizados/p7.jpg",
    "/personalizados/p8.jpg",
    "/personalizados/p9.jpg",
    "/personalizados/p10.jpg",
    "/personalizados/p11.jpg",
    "/personalizados/p12.jpg",
    "/personalizados/p13.jpg",
    "/personalizados/p14.jpg",
    "/personalizados/p15.jpg",
];

const testimonios = [
    {
        nombre: "Lucía Fernández",
        texto: "Les mandé mi diseño y en menos de una semana tenía mi remera personalizada. ¡Excelente calidad y atención!",
        avatar: "/avatars/lucia.jpg",
    },
    {
        nombre: "Juan López",
        texto: "Les pedí una campera con mi logo para mi emprendimiento y quedó perfecta. Recomendadísimos.",
        avatar: "/avatars/juan.jpg",
    },
    {
        nombre: "Camila Torres",
        texto: "Me encantó poder personalizar mi prenda desde cero, el resultado fue incluso mejor de lo esperado.",
        avatar: "/avatars/camila.jpg",
    },
];

export default function PersonalizadosSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const pasosRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const testimoniosRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
            heroRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        const sections = [
            { ref: pasosRef, delay: 0 },
            { ref: galleryRef, delay: 0.1 },
            { ref: testimoniosRef, delay: 0.2 },
        ];

        sections.forEach(({ ref, delay }) => {
            if (ref.current) {
                gsap.fromTo(
                    ref.current.children,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.15,
                        delay,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: ref.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const whatsappLink =
        "https://wa.me/5491124969558?text=Hola!%20Quiero%20consultar%20por%20un%20trabajo%20personalizado.";

    return (
        <Box as="section" py={{ base: 10, md: 20 }} px={{ base: 4, md: 10 }}>
            <VStack ref={heroRef} gap={4} textAlign="center" mb={10}>
                <Heading
                    as="h2"
                    fontSize={{ base: "2xl", md: "4xl" }}
                    color="red.500"
                >
                    Personalizá tu prenda con nosotros
                </Heading>
                <Text maxW="600px" color="gray.600" _dark={{ color: "gray.300" }} fontSize={{ base: "md", md: "lg" }}>
                    Transformamos tus ideas en prendas únicas. Desde frases, logos o ilustraciones,
                    hacemos realidad tu diseño con la mejor calidad.
                </Text>
                <Link href={whatsappLink} target="_blank">
                    <Button
                        size="lg"
                        colorPalette="green"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="all 0.3s ease"
                    >
                        <FaWhatsapp />  Contanos tu idea
                    </Button>
                </Link>
            </VStack>

            <VStack ref={pasosRef} gap={8} mb={16}>
                <Heading as="h3" size="lg" textAlign="center">
                    ¿Cómo funciona?
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
                    <VStack
                        bg="bg"
                        p={6}
                        borderRadius="xl"
                        boxShadow="md"
                        _hover={{ transform: "translateY(-5px)" }}
                        transition="all 0.3s ease"
                    >
                        <FaCheckCircle size={32} color="#E53E3E" />
                        <Heading size="md">1. Contanos tu idea</Heading>
                        <Text textAlign="center">
                            Mandanos tu diseño o concepto por WhatsApp o email. Te asesoramos sin compromiso.
                        </Text>
                    </VStack>

                    <VStack
                        bg="bg"
                        p={6}
                        borderRadius="xl"
                        boxShadow="md"
                        _hover={{ transform: "translateY(-5px)" }}
                        transition="all 0.3s ease"
                    >
                        <FaCheckCircle size={32} color="#E53E3E" />
                        <Heading size="md">2. Creamos tu propuesta</Heading>
                        <Text textAlign="center">
                            Te mostramos una vista previa digital antes de producir, para que apruebes el diseño.
                        </Text>
                    </VStack>

                    <VStack
                        bg="bg"
                        p={6}
                        borderRadius="xl"
                        boxShadow="md"
                        _hover={{ transform: "translateY(-5px)" }}
                        transition="all 0.3s ease"
                    >
                        <FaCheckCircle size={32} color="#E53E3E" />
                        <Heading size="md">3. Lo hacemos realidad</Heading>
                        <Text textAlign="center">
                            Producimos tu prenda y la enviamos directamente a tu domicilio 🚚✨
                        </Text>
                    </VStack>
                </SimpleGrid>
            </VStack>

            <VStack ref={galleryRef} gap={8} mb={16}>
                <Heading as="h3" size="lg" textAlign="center">
                    Algunos de nuestros trabajos
                </Heading>

                <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
                    {images.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt={`Trabajo personalizado ${i + 1}`}
                            borderRadius="lg"
                            objectFit="cover"
                            w="100%"
                            h="250px"
                            boxShadow="md"
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "xl",
                            }}
                            transition="all 0.3s ease"
                        />
                    ))}
                </SimpleGrid>
            </VStack>

            <VStack ref={testimoniosRef} gap={8} mb={16}>
                <Heading as="h3" size="lg" textAlign="center">
                    Lo que dicen nuestros clientes
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                    {testimonios.map((t, i) => (
                        <Card.Root
                            key={i}
                            boxShadow="lg"
                            borderRadius="xl"
                            p={4}
                            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                            transition="all 0.3s ease"
                        >
                            <Card.Body>
                                <VStack gap={3} textAlign="center">
                                    <Avatar.Root size="lg">
                                        <Avatar.Fallback name={t.nombre} />
                                        <Avatar.Image src={t.avatar} />
                                    </Avatar.Root>
                                    <Text fontStyle="italic" color="gray.600" _dark={{ color: "gray.300" }}>
                                        “{t.texto}”
                                    </Text>
                                    <Text fontWeight="bold">{t.nombre}</Text>
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    ))}
                </SimpleGrid>
            </VStack>

            <Flex justify="center">
                <Link href={whatsappLink} target="_blank">
                    <Button
                        size="lg"
                        colorPalette="green"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="all 0.3s ease"
                    >
                        <FaWhatsapp /> Hablá con nosotros por WhatsApp
                    </Button>
                </Link>
            </Flex>
        </Box>
    );
}