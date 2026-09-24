import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen por defecto al compartir links del sitio (WhatsApp, Instagram, etc.).
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo_aoe.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={300} height={305} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
            AOE
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#e11d2e", textTransform: "uppercase" }}>
            Indumentaria
          </div>
          <div style={{ fontSize: 30, color: "#a3a3a3", marginTop: 28, maxWidth: 620 }}>
            Remeras y buzos de anime, rock y series. Estampas propias y talles reales.
          </div>
        </div>
      </div>
    ),
    size
  );
}
