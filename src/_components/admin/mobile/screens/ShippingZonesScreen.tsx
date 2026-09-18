"use client";

import { ShippingZone } from "@/types/shippingZone.types";
import ListShippingZones from "../../shippingZones/ListShippingZones";

export default function ShippingZonesScreen({ zones }: { zones: ShippingZone[] }) {
  return <ListShippingZones zones={zones} />;
}
