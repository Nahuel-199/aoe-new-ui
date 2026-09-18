"use server";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "AOE-Indumentaria-Ecommerce/1.0 (https://www.aoe-indumentaria.com)";

interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Geocodifica una dirección argentina usando Nominatim (OpenStreetMap).
 * Se llama server-side porque Nominatim exige un User-Agent identificable,
 * header que los navegadores no permiten setear desde el cliente.
 */
export async function geocodeAddress(
  query: string
): Promise<{ success: true; result: GeocodeResult } | { success: false; message: string }> {
  try {
    const url = new URL(`${NOMINATIM_BASE_URL}/search`);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("countrycodes", "ar");
    url.searchParams.set("limit", "1");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) throw new Error(`Nominatim respondió ${res.status}`);

    const data = await res.json();
    const first = data?.[0];

    if (!first) {
      return {
        success: false,
        message: "No pudimos encontrar esa dirección en el mapa. Podés ubicarla manualmente.",
      };
    }

    return {
      success: true,
      result: {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
        displayName: first.display_name,
      },
    };
  } catch (error) {
    console.error("Error geocodificando dirección:", error);
    return { success: false, message: "Error al buscar la dirección en el mapa" };
  }
}
