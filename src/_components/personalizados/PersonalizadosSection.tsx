"use client";

import { useEffect, useRef } from "react";
import { Box, Text, SimpleGrid, VStack, Flex, Image, Avatar } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";
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

const pasos = [
    { n: "01", title: "Contanos tu idea", body: "Mandanos tu diseño o concepto por WhatsApp o email. Te asesoramos sin compromiso." },
    { n: "02", title: "Creamos tu propuesta", body: "Te mostramos una vista previa digital antes de producir, para que apruebes el diseño." },
    { n: "03", title: "Lo hacemos realidad", body: "Producimos tu prenda y la enviamos directamente a tu domicilio." },
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
        <Box as="section" maxW="900px" mx="auto" py={{ base: 10, md: "48px" }} px={{ base: 4, md: 5 }}>
            <Box ref={heroRef}>
                <Text
                    fontFamily="heading"
                    fontSize={{ base: "38px", md: "clamp(38px, 8vw, 88px)" }}
                    lineHeight="0.88"
                    textTransform="uppercase"
                    color="aoe.text"
                    m={0}
                >
                    Tu idea,<br />nuestra <Text as="span" color="aoe.red">prenda</Text>
                </Text>
                <Text color="aoe.textMuted" fontSize="17px" lineHeight="1.55" maxW="560px" mt="22px" mb="36px">
                    Mandanos tu diseño o contanos la idea. Cotizamos en el día y producimos desde 1 unidad.
                </Text>
            </Box>

            <SimpleGrid ref={pasosRef} columns={{ base: 1, md: 3 }} gap="14px" mb={16}>
                {pasos.map((s) => (
                    <Box
                        key={s.n}
                        border="1px solid"
                        borderColor="aoe.borderSubtle"
                        borderRadius="18px"
                        p="22px"
                        bg="aoe.tile"
                    >
                        <Text fontFamily="heading" fontSize="40px" color="aoe.red" lineHeight={1}>
                            {s.n}
                        </Text>
                        <Text fontSize="14px" fontWeight="800" letterSpacing="0.06em" textTransform="uppercase" color="aoe.text" mt="10px">
                            {s.title}
                        </Text>
                        <Text color="aoe.textSubtle" fontSize="13px" mt="8px" lineHeight="1.5">
                            {s.body}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>

            <Link href={whatsappLink} target="_blank">
                <Flex
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    h="56px"
                    px="28px"
                    mb={16}
                    borderRadius="pill"
                    bg="aoe.red"
                    color="white"
                    fontFamily="mono"
                    fontSize="14px"
                    fontWeight="800"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    _hover={{ bg: "aoe.text", color: "aoe.bg" }}
                    transition="all 0.2s ease"
                >
                    <FaWhatsapp /> Pedir cotización
                </Flex>
            </Link>

            <VStack ref={galleryRef} gap={6} mb={16} align="stretch">
                <Text fontFamily="heading" fontSize={{ base: "26px", md: "clamp(26px, 4vw, 40px)" }} textTransform="uppercase" color="aoe.text">
                    Algunos de nuestros trabajos
                </Text>
                <SimpleGrid columns={{ base: 2, md: 5 }} gap="12px">
                    {images.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt={`Trabajo personalizado ${i + 1}`}
                            borderRadius="14px"
                            objectFit="cover"
                            w="100%"
                            h="200px"
                            _hover={{ outline: "2px solid", outlineColor: "aoe.red" }}
                            transition="all 0.2s ease"
                        />
                    ))}
                </SimpleGrid>
            </VStack>

            <VStack ref={testimoniosRef} gap={6} mb={16} align="stretch">
                <Text fontFamily="heading" fontSize={{ base: "26px", md: "clamp(26px, 4vw, 40px)" }} textTransform="uppercase" color="aoe.text">
                    Lo que dicen nuestros clientes
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap="14px">
                    {testimonios.map((t, i) => (
                        <Box
                            key={i}
                            border="1px solid"
                            borderColor="aoe.borderSubtle"
                            borderRadius="18px"
                            bg="aoe.tile"
                            p="22px"
                        >
                            <VStack gap={3} textAlign="center">
                                <Avatar.Root size="lg">
                                    <Avatar.Fallback name={t.nombre} />
                                    <Avatar.Image src={t.avatar} />
                                </Avatar.Root>
                                <Text fontStyle="italic" color="aoe.textSubtle" fontSize="14px">
                                    "{t.texto}"
                                </Text>
                                <Text fontWeight="700" color="aoe.text" fontSize="14px">
                                    {t.nombre}
                                </Text>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </VStack>

            <Flex justify="center">
                <Link href={whatsappLink} target="_blank">
                    <Flex
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        gap={2}
                        h="56px"
                        px="28px"
                        borderRadius="pill"
                        bg="aoe.red"
                        color="white"
                        fontFamily="mono"
                        fontSize="14px"
                        fontWeight="800"
                        letterSpacing="0.1em"
                        textTransform="uppercase"
                        _hover={{ bg: "aoe.text", color: "aoe.bg" }}
                        transition="all 0.2s ease"
                    >
                        <FaWhatsapp /> Hablá con nosotros
                    </Flex>
                </Link>
            </Flex>
        </Box>
    );
}
