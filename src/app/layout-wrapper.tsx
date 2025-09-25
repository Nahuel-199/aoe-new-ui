"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/_components/home/navbar/Navbar";
import FooterSection from "@/_components/home/footer/FooterSection";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <FooterSection />}
    </>
  );
}
