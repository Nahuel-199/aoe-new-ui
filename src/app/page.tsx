'use client';

import OfferBanner from "@/_components/home/banner/OfferBanner";
import CategoriesSection from "@/_components/home/categories/CategoriesSection";
import HeaderSection from "@/_components/home/header/HeaderSection";
import ShipmentsSection from "@/_components/home/shipments/ShipmentsSection";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getSession } from "@/lib/actions/auth.actions";

export default function Home() {

  return (
    <>
    <HeaderSection />
    <CategoriesSection />
    <ShipmentsSection />
    <OfferBanner />
    </>
  )
  // const router = useRouter();

  // useEffect(() => {
  //   const redirectUser = async () => {
  //     const session = await getSession();

  //     if (session?.user) {
  //       router.replace("/home");
  //     } else {
  //       router.replace("/login");
  //     }
  //   };

  //   redirectUser();
  // }, [router]);

  // return null;
}
