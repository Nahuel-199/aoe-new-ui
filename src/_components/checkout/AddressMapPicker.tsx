"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816]; // Obelisco, CABA

interface AddressMapPickerProps {
  lat?: number;
  lng?: number;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function AddressMapPicker({
  lat,
  lng,
  onPositionChange,
}: AddressMapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const icon = L.icon({
      iconUrl: markerIcon.src,
      iconRetinaUrl: markerIcon2x.src,
      shadowUrl: markerShadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const initialCenter: [number, number] =
      lat !== undefined && lng !== undefined ? [lat, lng] : DEFAULT_CENTER;

    const map = L.map(containerRef.current).setView(
      initialCenter,
      lat !== undefined ? 16 : 12
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(initialCenter, { icon, draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onPositionChangeRef.current(pos.lat, pos.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onPositionChangeRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (lat === undefined || lng === undefined) return;

    const current = markerRef.current.getLatLng();
    if (current.lat === lat && current.lng === lng) return;

    markerRef.current.setLatLng([lat, lng]);
    mapRef.current.setView([lat, lng], 16);
  }, [lat, lng]);

  return (
    <Box
      ref={containerRef}
      w="full"
      h="280px"
      borderRadius="10px"
      overflow="hidden"
      border="1px solid"
      borderColor="aoe.borderSubtle"
    />
  );
}
