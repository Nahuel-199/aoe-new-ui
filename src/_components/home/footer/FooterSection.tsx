'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Link, Image, Grid, Stack, Dialog, Portal } from '@chakra-ui/react';
import { gsap } from 'gsap';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { sizeChartUrls } from '@/utils/sizeChartUrls';

const sizeChartTypes = Object.keys(sizeChartUrls);

const FooterSection: React.FC = () => {
  const iconsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const [shippingInfoOpen, setShippingInfoOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [selectedSizeChartType, setSelectedSizeChartType] = useState(sizeChartTypes[0]);

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
            <Text
              as="button"
              textAlign="left"
              cursor="pointer"
              onClick={() => setShippingInfoOpen(true)}
              _hover={{ color: 'aoe.text' }}
            >
              Envíos y tiempos
            </Text>
            <Text
              as="button"
              textAlign="left"
              cursor="pointer"
              onClick={() => setSizeChartOpen(true)}
              _hover={{ color: 'aoe.text' }}
            >
              Tablas de talles
            </Text>
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

      <Dialog.Root
        open={shippingInfoOpen}
        onOpenChange={(details) => setShippingInfoOpen(details.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.700" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="aoe.surface"
              border="1px solid"
              borderColor="aoe.borderSubtle"
              borderRadius="18px"
              maxW="420px"
              mx={4}
            >
              <Dialog.Header>
                <Dialog.Title
                  fontFamily="heading"
                  textTransform="uppercase"
                  letterSpacing="0.02em"
                  color="aoe.text"
                >
                  Envíos y tiempos
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="aoe.textMuted" fontSize="14px" lineHeight="1.6">
                  Los pedidos demoran entre 5 y 7 días después de realizado el encargo.
                  Una vez que confirmes tu compra, te iremos informando el estado de tu
                  producto hasta que llegue a tus manos.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Box
                  as="button"
                  onClick={() => setShippingInfoOpen(false)}
                  h="40px"
                  px="20px"
                  borderRadius="pill"
                  border="none"
                  bg="aoe.text"
                  color="aoe.bg"
                  fontFamily="mono"
                  fontSize="12px"
                  fontWeight="800"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  cursor="pointer"
                  _hover={{ bg: 'aoe.red', color: 'white' }}
                >
                  Entendido
                </Box>
              </Dialog.Footer>
              <Dialog.CloseTrigger color="aoe.textMuted" />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={sizeChartOpen}
        onOpenChange={(details) => setSizeChartOpen(details.open)}
        placement="center"
        size="lg"
      >
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.700" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="aoe.surface"
              border="1px solid"
              borderColor="aoe.borderSubtle"
              borderRadius="18px"
              maxW="560px"
              mx={4}
            >
              <Dialog.Header>
                <Dialog.Title
                  fontFamily="heading"
                  textTransform="uppercase"
                  letterSpacing="0.02em"
                  color="aoe.text"
                >
                  Tablas de talles
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap={4}>
                  <Stack direction="row" gap={2} flexWrap="wrap">
                    {sizeChartTypes.map((type) => (
                      <Box
                        key={type}
                        as="button"
                        onClick={() => setSelectedSizeChartType(type)}
                        px="12px"
                        h="32px"
                        borderRadius="pill"
                        border="1px solid"
                        borderColor={selectedSizeChartType === type ? 'aoe.red' : 'aoe.borderControl'}
                        bg={selectedSizeChartType === type ? 'aoe.red' : 'transparent'}
                        color={selectedSizeChartType === type ? 'white' : 'aoe.textMuted'}
                        fontFamily="mono"
                        fontSize="11px"
                        letterSpacing="0.04em"
                        cursor="pointer"
                        _hover={{ borderColor: 'aoe.red' }}
                      >
                        {type}
                      </Box>
                    ))}
                  </Stack>

                  <Box borderRadius="12px" overflow="hidden" bg="aoe.tile">
                    <Image
                      src={sizeChartUrls[selectedSizeChartType]}
                      alt={`Tabla de talles ${selectedSizeChartType}`}
                      w="100%"
                      h="auto"
                      objectFit="contain"
                    />
                  </Box>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Box
                  as="button"
                  onClick={() => setSizeChartOpen(false)}
                  h="40px"
                  px="20px"
                  borderRadius="pill"
                  border="none"
                  bg="aoe.text"
                  color="aoe.bg"
                  fontFamily="mono"
                  fontSize="12px"
                  fontWeight="800"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  cursor="pointer"
                  _hover={{ bg: 'aoe.red', color: 'white' }}
                >
                  Entendido
                </Box>
              </Dialog.Footer>
              <Dialog.CloseTrigger color="aoe.textMuted" />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default FooterSection;
