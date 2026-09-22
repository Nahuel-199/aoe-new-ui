import CategoriesSection from "@/_components/home/categories/CategoriesSection";
import HeaderSection from "@/_components/home/header/HeaderSection";
import OfferSlider from "@/_components/home/offer/OfferSlider";
import ShipmentsSection from "@/_components/home/shipments/ShipmentsSection";
import { getOffers } from "@/lib/actions/product.actions";
import { getHeroBanners } from "@/lib/actions/heroBanner.actions";

export default async function Home() {
  const [offers, heroBanners] = await Promise.all([getOffers(), getHeroBanners()]);

  return (
    <>
      <HeaderSection offers={offers} heroBanners={heroBanners} />
      <ShipmentsSection />
      <OfferSlider offers={offers} />
      <CategoriesSection />
    </>
  );
}
