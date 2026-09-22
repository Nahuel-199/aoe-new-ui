export const colorMap: Record<string, string> = {
  Blanco: "#FFFFFF",
  Negro: "#000000",
  Rojo: "#FF0000",
  Azul: "#0000FF",
  Verde: "#008000",
  Vison: "#D2B48C",
  Bordo: "#800020",
  Gris: "#808080",
  Natural: "#F5F5DC",
  "Verde oliva": "#808000",
  "Azul francia": "#0033A0",
  Beige: "#F5F5DC",
  "Gris topo": "#505050",
  Rosa: "#FFC0CB",
};

const normalizedColorMap: Record<string, string> = Object.fromEntries(
  Object.entries(colorMap).map(([name, hex]) => [name.toLowerCase(), hex])
);

/**
 * Datos viejos pueden tener el color guardado con otra capitalización
 * (ej: "negro" en vez de "Negro"), lo que hacía fallar el lookup directo
 * por `colorMap[color]` y mostraba el swatch gris por defecto.
 */
export const getColorHex = (name?: string | null): string | undefined =>
  name ? normalizedColorMap[name.trim().toLowerCase()] : undefined;
