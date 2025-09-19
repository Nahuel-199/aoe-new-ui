import LoginSection from '@/_components/login/LoginSection'
import { signIn } from '@/auth';

export default function page() {
    async function handleLogin() {
        "use server";
        await signIn("google", { redirectTo: "/home" });
    }

    return <LoginSection handleLogin={handleLogin} />;
}
