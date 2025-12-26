"use client";

import { SessionProvider } from "next-auth/react";

export function ProviderSesion({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Reducir polling automático de la sesión
      refetchInterval={0} // Desactivar polling automático
      refetchOnWindowFocus={false} // No refrescar al enfocar la ventana
      // Solo refrescar cuando sea necesario (login/logout)
    >
      {children}
    </SessionProvider>
  );
}