'use client';

import { Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import React from 'react';

export default function SkeletonNav() {
    return (
        <Flex justify="center" align="center" p={4}>
            <Skeleton height="55px" width="550px" />
            <Flex align="center" gap={4}>
                <SkeletonCircle size="12" gap={6} ml={4} />
            </Flex>
        </Flex>
    )
}
