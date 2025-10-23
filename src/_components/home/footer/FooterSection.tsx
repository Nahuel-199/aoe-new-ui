'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Text, Link, Image } from '@chakra-ui/react';
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
    <Box bg="white" _dark={{ bg: "black" }} color="white" p={4} textAlign="center" h={{ base:"20vh", lg: "25vh"}}>
      <Image
          position={"absolute"}
          opacity={0.2}
          src="/logo_aoe.png"
          boxSize={{ base: 20, md: 160 }}
          alt="Logo AOE"
          ref={logoRef}
        />
      <Box mb={6} mt={8} display="flex" justifyContent="center" gap={2} ref={iconsRef}> 
        <Text fontSize={{ base: "lg", md: "4xl" }} fontWeight="bold" color="red.500" textAlign={"center"}>
          AOE <Text as="span" color={"black"} _dark={{ color: 'white' }}>INDUMENTARIA</Text>
        </Text>
        <Link href="https://www.instagram.com/aoe_indumentaria">
          <FaInstagram size={32} color="#E4405F"/>
        </Link>
        <Link href="https://wa.me/5491124969558">
          <FaWhatsapp size={32} color="#25D366" />
        </Link>
      </Box>

      <Text fontSize={{ base: 'xs', md: 'sm' }} color={"black"} _dark={{ color: "white" }} mt={12}>
        &copy; 2025 AOE INDUMENTARIA. Todos los derechos reservados.
      </Text>
    </Box>
  );
};

export default FooterSection;