"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Lleva el scroll arriba en cada navegación nueva (link o router.push).
 *
 * El scroll automático de Next no funciona en este proyecto: para decidir a
 * dónde scrollear busca el primer elemento del segmento nuevo, que acá termina
 * siendo un nodo que React ubica en el <head>, y como no encuentra nada visible
 * no hace nada. El resultado era entrar al detalle de un producto a la misma
 * altura en la que estaba el catálogo.
 *
 * En atrás/adelante del navegador (popstate) no se toca el scroll, para que el
 * navegador restaure la posición en la que estaba el usuario.
 */
export function useScrollToTopOnNavigate() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // En la carga inicial (o un refresh) el navegador maneja la posición.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
}
