import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo";
import LoginSection from '@/_components/login/LoginSection'
import { signIn } from '@/auth';

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: NO_INDEX,
};

export default function page() {
    async function handleLogin() {
        "use server";
        await signIn("google", { redirectTo: "/" });
    }

    return <LoginSection handleLogin={handleLogin} />;
}
