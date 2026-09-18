export interface ShippingAddress {
  street: string;
  streetNumber: string;
  floorApt?: string;
  city: string;
  province: string;
  postalCode: string;
  lat?: number;
  lng?: number;
}
