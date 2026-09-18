import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { ProviderSesion } from "./providers";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./layout-wrapper";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

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
 title: "Aoe indumentaria Eccomerce",
  description: "Indumentaria, Ropa, Emprendimiento, Eccomerce, tienda virtual, Ofertas, Vestimenta, Rock, Anime, Variados",
  icons: "/logo_aoe.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${archivo.variable} ${jetbrainsMono.variable} ${archivo.className}`}
      >
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
