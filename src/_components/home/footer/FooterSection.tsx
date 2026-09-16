'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Text, Link, Image, Grid, Stack } from '@chakra-ui/react';
import { gsap } from 'gsap';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

const FooterSection: React.FC = () => {
  const iconsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotationY: 360,
        repeat: -1,
        duration: 8,
        ease: 'linear',
      });
    }

    if (iconsRef.current) {
      gsap.to(iconsRef.current.children, {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: 'power1.inOut',
        stagger: 0.2,
      });
    }
  }, []);

  return (
    <Box as="footer" borderTop="1px solid" borderColor="aoe.borderSubtle" bg="aoe.bgAlt">
      <Grid
        maxW="1360px"
        mx="auto"
        px={{ base: 4, md: 5 }}
        py={{ base: 10, md: "52px" }}
        templateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(200px, 1fr))" }}
        gap={8}
      >
        <Box>
          <Image
            ref={logoRef}
            src="/logo_aoe.png"
            alt="Logo AOE"
            h="46px"
            w="auto"
            mb="14px"
          />
          <Text fontFamily="heading" fontSize="22px" textTransform="uppercase" color="aoe.text">
            AOE Indumentaria
          </Text>
          <Text color="aoe.textSubtle" fontSize="13px" mt={2} lineHeight="1.5" maxW="260px">
            Estampas de anime, rock y series. Buenos Aires, Argentina.
          </Text>
        </Box>

        <Box>
          <Text fontFamily="mono" fontSize="10px" letterSpacing="0.14em" color="aoe.textFaint" textTransform="uppercase" mb={3}>
            Tienda
          </Text>
          <Stack gap={2} fontSize="14px" color="aoe.textMuted">
            <Link href="/products?category=Remeras">Remeras</Link>
            <Link href="/products?category=Buzos">Buzos</Link>
            <Link href="/products?category=Ofertas">Ofertas</Link>
            <Link href="/personalizados">Personalizados</Link>
          </Stack>
        </Box>

        <Box>
          <Text fontFamily="mono" fontSize="10px" letterSpacing="0.14em" color="aoe.textFaint" textTransform="uppercase" mb={3}>
            Ayuda
          </Text>
          <Stack gap={2} fontSize="14px" color="aoe.textMuted">
            <Text>Envíos y tiempos</Text>
            <Text>Cambios y devoluciones</Text>
            <Text>Guía de talles</Text>
            <Link href="/mis-pedidos">Seguir mi pedido</Link>
          </Stack>
        </Box>

        <Box>
          <Text fontFamily="mono" fontSize="10px" letterSpacing="0.14em" color="aoe.textFaint" textTransform="uppercase" mb={3}>
            Contacto
          </Text>
          <Stack gap={2} fontSize="14px" ref={iconsRef} align="start">
            <Link href="https://www.instagram.com/aoe_indumentaria" display="inline-flex" alignItems="center" gap={2} color="aoe.text" _hover={{ color: "aoe.red" }}>
              <FaInstagram size={18} /> @aoe_indumentaria
            </Link>
            <Link href="https://wa.me/5491124969558" display="inline-flex" alignItems="center" gap={2} color="aoe.text" _hover={{ color: "aoe.red" }}>
              <FaWhatsapp size={18} /> WhatsApp 11 2496-9558
            </Link>
          </Stack>
        </Box>
      </Grid>

      <Stack
        direction={{ base: "column", md: "row" }}
        maxW="1360px"
        mx="auto"
        px={{ base: 4, md: 5 }}
        py="18px"
        borderTop="1px solid"
        borderColor="aoe.borderSubtle"
        justify="space-between"
        gap={3}
        fontFamily="mono"
        fontSize="10px"
        color="aoe.textGhost"
        letterSpacing="0.08em"
      >
        <Text>© 2026 AOE INDUMENTARIA</Text>
        <Text>MERCADO PAGO · CORREO ARGENTINO · MOTO ENVÍO</Text>
      </Stack>
    </Box>
  );
};

export default FooterSection;
