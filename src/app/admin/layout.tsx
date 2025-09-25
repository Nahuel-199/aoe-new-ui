'use client';

import Sidebar from "@/_components/admin/sidebar/Sidebar";
import { HStack, Box } from "@chakra-ui/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <HStack
            align="start"
            p={2}
            w="full"
            flexDir={{ base: "column", md: "row" }}
        >
            <Sidebar />
            <Box flex="1" p={6} w="full">
                {children}
            </Box>
        </HStack>
    );
}
