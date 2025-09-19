'use client';
import React, { useEffect, useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { gsap } from 'gsap';
import Link from 'next/link';

const categories = [
  { name: 'Remeras', image: '/remera1.jpg' },
  { name: 'Buzos', image: '/buzo1.jpg' },
  { name: 'Camperas', image: '/campera1.jpg' },
];

const CategoryCard: React.FC<{ name: string; image: string }> = ({ name, image }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { x: -200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }
      );
    }

    const isMobile = window.innerWidth < 768;

    if (isMobile && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0.3,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'power1.inOut',
      });
    }
  }, []);

  return (
    <Box
      ref={cardRef}
      position="relative"
      width="100%"
      height={{ base: '200px', md: '400px', lg: '500px' }}
      overflow="hidden"
      border="2px solid black"
      _dark={{ border: '2px solid white' }}
      borderRadius="md"
      boxShadow="md"
      _hover={{
        cursor: 'pointer',
        transform: 'scale(1.05)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <Box
        bgImage={`url(${image})`}
        bgSize="cover"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        transition="opacity 0.3s ease"
        overflow="hidden"
      />
      <Box
        ref={overlayRef}
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(0, 0, 0, 0.5)"
        opacity={{ base: 1, md: 0 }}
        _hover={{ opacity: 1 }}
        transition="opacity 0.3s ease"
      >
        <Text
          fontSize={{ base: '3xl', md: '3xl', lg: '5xl' }}
          color="white"
          fontWeight="bold"
          textAlign="center"
          textTransform="uppercase"
        >
          {name}
        </Text>
      </Box>
    </Box>
  );
};

const CategoriesSection: React.FC = () => {
  return (
    <Link href={"/products"}>
    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={6} p={6}>
      {categories.map((category, index) => (
        <CategoryCard key={index} name={category.name} image={category.image} />
      ))}
    </Box>
    </Link>
  );
};

export default CategoriesSection;