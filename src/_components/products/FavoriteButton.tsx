"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IconButton } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/context/FavoritesContext";

interface FavoriteButtonProps {
  productId: string;
  variant?: "overlay" | "inline";
}

export default function FavoriteButton({ productId, variant = "overlay" }: FavoriteButtonProps) {
  const { status } = useSession();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const active = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setPending(true);
    try {
      await toggleFavorite(productId);
    } finally {
      setPending(false);
    }
  };

  const label = active ? "Quitar de favoritos" : "Agregar a favoritos";
  const icon = active ? <FaHeart /> : <FaRegHeart />;

  if (variant === "overlay") {
    return (
      <IconButton
        aria-label={label}
        onClick={handleClick}
        loading={pending}
        size="sm"
        position="absolute"
        top="10px"
        right="10px"
        zIndex={1}
        borderRadius="pill"
        border="none"
        bg="rgba(10,10,10,0.55)"
        backdropFilter="blur(4px)"
        color={active ? "aoe.red" : "white"}
        _hover={{ bg: "rgba(10,10,10,0.75)" }}
      >
        {icon}
      </IconButton>
    );
  }

  return (
    <IconButton
      aria-label={label}
      onClick={handleClick}
      loading={pending}
      size="sm"
      variant="outline"
      borderRadius="pill"
      borderColor="aoe.borderControl"
      bg="aoe.chip"
      color={active ? "aoe.red" : "aoe.text"}
      _hover={{ borderColor: "aoe.red" }}
    >
      {icon}
    </IconButton>
  );
}
