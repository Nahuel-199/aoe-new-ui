import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { ProviderSesion } from "./providers";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./layout-wrapper";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
      <body className={`${poppins.className}`}>
        <Provider>
          <ProviderSesion>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </ProviderSesion>
        </Provider>
      </body>
    </html>
  );
}
