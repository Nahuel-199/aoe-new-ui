/**
 * Optimización de imágenes vía transformaciones de Cloudinary en la URL:
 * f_auto sirve AVIF/WebP según el navegador, q_auto ajusta la calidad y
 * c_limit + w_N achica sin agrandar. Las URLs que no son de Cloudinary
 * (p. ej. archivos de /public) se devuelven sin tocar.
 */

const UPLOAD_SEGMENT = "/image/upload/";
const RESPONSIVE_WIDTHS = [320, 480, 640, 828, 1080, 1440];

export function isCloudinaryUrl(url: string | undefined): url is string {
  return !!url && url.includes("res.cloudinary.com") && url.includes(UPLOAD_SEGMENT);
}

export function cldUrl(url: string, width: number): string;
export function cldUrl(url: string | undefined, width: number): string | undefined;
export function cldUrl(url: string | undefined, width: number) {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}f_auto,q_auto,c_limit,w_${width}/`);
}

interface CldImageOptions {
  /** Atributo `sizes`: ancho con el que se muestra la imagen según el viewport. */
  sizes: string;
  /** Ancho máximo a generar (por defecto 1440). */
  maxWidth?: number;
  /** Imagen principal visible al cargar (LCP): se pide con prioridad y sin lazy. */
  priority?: boolean;
}

/**
 * Props para <Image>/<img> responsive: src + srcSet + sizes + carga diferida.
 * Uso: <Image {...cldImage(url, { sizes: "(min-width: 768px) 50vw, 100vw" })} alt="…" />
 */
export function cldImage(url: string | undefined, { sizes, maxWidth = 1440, priority }: CldImageOptions) {
  const loading = priority ? ("eager" as const) : ("lazy" as const);
  const base = {
    loading,
    decoding: "async" as const,
    ...(priority ? { fetchPriority: "high" as const } : {}),
  };
  if (!isCloudinaryUrl(url)) return { ...base, src: url };

  const widths = RESPONSIVE_WIDTHS.filter((w) => w < maxWidth).concat(maxWidth);
  return {
    ...base,
    src: cldUrl(url, widths.includes(828) ? 828 : maxWidth),
    srcSet: widths.map((w) => `${cldUrl(url, w)} ${w}w`).join(", "),
    sizes,
  };
}

/** Miniaturas de ancho fijo (carrito, pedidos, admin): 1x y 2x para pantallas retina. */
export function cldThumb(url: string | undefined, displayWidth: number) {
  const base = { loading: "lazy" as const, decoding: "async" as const };
  if (!isCloudinaryUrl(url)) return { ...base, src: url };
  return {
    ...base,
    src: cldUrl(url, displayWidth * 2),
    srcSet: `${cldUrl(url, displayWidth)} 1x, ${cldUrl(url, displayWidth * 2)} 2x`,
  };
}
