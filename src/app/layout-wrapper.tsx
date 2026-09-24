"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/_components/home/navbar/Navbar";
import FooterSection from "@/_components/home/footer/FooterSection";
import OfferBanner from "@/_components/home/banner/OfferBanner";
import CartDrawer from "@/_components/cart/CartDrawer";
import { Box } from "@chakra-ui/react";
import { useScrollToTopOnNavigate } from "@/hooks/useScrollToTopOnNavigate";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  useScrollToTopOnNavigate();

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <Box bg="aoe.bg" color="aoe.text" minH="100vh" overflowX="hidden">
      <OfferBanner />
      <Navbar />
      {children}
      <FooterSection />
      <CartDrawer />
    </Box>
  );
}
