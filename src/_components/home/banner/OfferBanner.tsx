'use client';

import React from 'react';
import { Box } from '@chakra-ui/react';

const items = [
    'Envío a todo el país · Correo Argentino',
    'Moto envío en CABA y GBA',
    '3 cuotas sin interés',
    'Envío gratis a partir de $70.000',
];

const Strip = () => (
    <Box
        as="span"
        display="flex"
        gap="40px"
        px="20px"
        flex="none"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
    >
        {items.map((item, i) => (
            <React.Fragment key={i}>
                <Box as="span">{item}</Box>
                <Box as="span">◆</Box>
            </React.Fragment>
        ))}
    </Box>
);

const OfferBanner: React.FC = () => {
    return (
        <Box
            bg="aoe.red"
            color="white"
            overflow="hidden"
            whiteSpace="nowrap"
            display="flex"
            py="7px"
        >
            <Box display="flex" flex="none" animation="aoeMarquee 26s linear infinite">
                <Strip />
                <Strip />
            </Box>
        </Box>
    );
};

export default OfferBanner;
