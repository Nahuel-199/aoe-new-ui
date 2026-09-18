"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  getFavoriteProductIds,
  toggleFavorite as toggleFavoriteAction,
} from "@/lib/actions/favorite.actions";

interface FavoritesContextType {
  favoriteIds: Set<string>;
  loading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    getFavoriteProductIds()
      .then((ids) => {
        if (active) setFavoriteIds(new Set(ids));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [status]);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.has(productId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      const wasFavorite = favoriteIds.has(productId);

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.delete(productId) : next.add(productId);
        return next;
      });

      try {
        const { isFavorite: nowFavorite } = await toggleFavoriteAction(productId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          nowFavorite ? next.add(productId) : next.delete(productId);
          return next;
        });
      } catch {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          wasFavorite ? next.add(productId) : next.delete(productId);
          return next;
        });
      }
    },
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
};
