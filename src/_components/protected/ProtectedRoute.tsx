'use client';

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth.actions";
import { Box, Spinner } from "@chakra-ui/react";

interface ProtectedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            if (!session?.user) {
                router.replace(redirectTo);
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router, redirectTo]);

    if (loading) return <Box>
        <Spinner />
    </Box>;

    return <>{children}</>;
}
