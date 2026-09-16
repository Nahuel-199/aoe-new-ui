'use client';
import React, { useEffect, useRef } from 'react';
import { Box, Text, Grid } from '@chakra-ui/react';
import { gsap } from 'gsap';
import Link from 'next/link';

const categories = [
  { name: 'Remeras', image: '/remera1.jpg' },
  { name: 'Buzos', image: '/buzo1.jpg' },
  { name: 'Camperas', image: '/campera1.jpg' },
];

const CategoryCard: React.FC<{ name: string; image: string }> = ({ name, image }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <Link href={`/products?category=${encodeURIComponent(name)}`}>
      <Box
        ref={cardRef}
        as="button"
        position="relative"
        w="100%"
        border="1px solid"
        borderColor="aoe.borderSubtle"
        borderRadius="18px"
        bg="aoe.tile"
        p={0}
        overflow="hidden"
        aspectRatio="3 / 2"
        display="block"
        textAlign="left"
        cursor="pointer"
        _hover={{ borderColor: 'aoe.red' }}
      >
        <Box
          bgImage={`url(${image})`}
          bgSize="cover"
          bgPos="center"
          position="absolute"
          inset={0}
          opacity={0.55}
        />
        <Box
          position="absolute"
          inset="auto 0 0 0"
          p="18px"
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          bgGradient="linear-gradient(transparent, rgba(10,10,10,0.92))"
        >
          <Text fontFamily="heading" fontSize="26px" textTransform="uppercase" lineHeight={1} color="aoe.text">
            {name}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

const CategoriesSection: React.FC = () => {
  return (
    <Box as="section" maxW="1360px" mx="auto" px={{ base: 4, md: 5 }} py={{ base: 10, md: '56px' }}>
      <Text fontFamily="heading" fontSize={{ base: '28px', md: 'clamp(28px, 4vw, 44px)' }} textTransform="uppercase" color="aoe.text" mb="22px">
        Elegí tu mundo
      </Text>
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(auto-fit, minmax(240px, 1fr))' }} gap="14px">
        {categories.map((category, index) => (
          <CategoryCard key={index} name={category.name} image={category.image} />
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesSection;
