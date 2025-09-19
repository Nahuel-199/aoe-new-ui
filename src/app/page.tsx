'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth.actions";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      const session = await getSession();

      if (session?.user) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    };

    redirectUser();
  }, [router]);

  return null;
}
