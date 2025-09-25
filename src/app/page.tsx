"use client";

import OfferBanner from "@/_components/home/banner/OfferBanner";
import CategoriesSection from "@/_components/home/categories/CategoriesSection";
import HeaderSection from "@/_components/home/header/HeaderSection";
import OfferSlider from "@/_components/home/offer/OfferSlider";
import ShipmentsSection from "@/_components/home/shipments/ShipmentsSection";

export default function Home() {
  return (
    <>
      <HeaderSection />
      <CategoriesSection />
      <ShipmentsSection />
      <OfferSlider />
      <OfferBanner />
    </>
  );
}
