"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Page() {
  const { openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    openCart();
    router.replace("/");
  }, []);

  return null;
}
