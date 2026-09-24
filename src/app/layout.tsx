import type { Metadata, Viewport } from "next";
import { Provider } from "@/components/ui/provider";
import { ProviderSesion } from "./providers";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./layout-wrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  jsonLd,
} from "@/lib/seo";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Remeras y buzos de anime, rock y series`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "remeras anime",
    "remeras de rock",
    "buzos estampados",
    "ropa de series",
    "indumentaria",
    "tienda online",
    "Argentina",
  ],
  icons: {
    icon: "/logo_aoe.ico",
    apple: "/logo_aoe.png",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo_aoe.png`,
      sameAs: SOCIAL_LINKS,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+54-9-11-2496-9558",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "es-AR",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Las variables de fuente van en <html>: los tokens de Chakra (fonts.heading,
    // fonts.mono) se declaran en :root y no ven variables definidas en <body>.
    <html
      lang="es-AR"
      className={`${anton.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={archivo.className}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationJsonLd)}
        />
        <Provider>
          <ProviderSesion>
            <CartProvider>
              <FavoritesProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </FavoritesProvider>
            </CartProvider>
          </ProviderSesion>
        </Provider>
      </body>
    </html>
  );
}
