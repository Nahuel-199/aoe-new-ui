import CategoriesSection from "@/_components/home/categories/CategoriesSection";
import HeaderSection from "@/_components/home/header/HeaderSection";
import OfferSlider from "@/_components/home/offer/OfferSlider";
import ShipmentsSection from "@/_components/home/shipments/ShipmentsSection";
import { getOffers } from "@/lib/actions/product.actions";

export default async function Home() {
  const offers = await getOffers();

  return (
    <>
      <HeaderSection offers={offers} />
      <ShipmentsSection />
      <OfferSlider offers={offers} />
      <CategoriesSection />
    </>
  );
}
