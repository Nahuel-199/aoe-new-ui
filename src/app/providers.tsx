"use client";

import { SessionProvider } from "next-auth/react";

export function ProviderSesion({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}