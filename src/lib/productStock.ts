import { Product } from "@/types/product.types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/adminNav";

export function getTotalStock(product: Product): number {
  return product.variants.reduce(
    (acc, v) => acc + v.sizes.reduce((a, s) => a + s.stock, 0),
    0
  );
}

export function isLowStock(product: Product): boolean {
  return product.variants.some((v) =>
    v.sizes.some((s) => s.stock > 0 && s.stock <= LOW_STOCK_THRESHOLD)
  );
}

export function isOutOfStock(product: Product): boolean {
  return getTotalStock(product) === 0;
}

export function isOnSale(product: Product): boolean {
  return product.variants.some((v) => v.is_offer);
}

export function getDisplayPricing(product: Product) {
  const offerVariant = product.variants.find((v) => v.is_offer);
  const basePrice = offerVariant?.price ?? product.variants[0]?.price ?? 0;
  const finalPrice = offerVariant?.price_offer ?? product.variants[0]?.price ?? 0;
  return { basePrice, finalPrice, onSale: Boolean(offerVariant) };
}
