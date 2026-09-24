import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import React from 'react'
import PersonalizadosSection from '@/_components/personalizados/PersonalizadosSection'

export const metadata: Metadata = pageMetadata({
  title: "Remeras y buzos personalizados",
  description:
    "Mandanos tu diseño o contanos la idea: estampamos remeras y buzos personalizados desde 1 unidad y cotizamos en el día. Pedí tu presupuesto por WhatsApp.",
  path: "/personalizados",
});

export default function page() {
  return (
    <div>
        <PersonalizadosSection />
    </div>
  )
}
