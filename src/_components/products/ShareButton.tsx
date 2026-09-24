"use client";

import { useEffect, useState, type ReactNode } from "react";
import { HStack, IconButton, Menu, Portal, Text } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiLink, FiShare2, FiMoreHorizontal } from "react-icons/fi";
import { showToast } from "nextjs-toast-notify";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

interface ShareButtonProps {
  productId: string;
  productName: string;
}

const toastOptions = {
  duration: 3500,
  progress: true,
  position: "top-center" as const,
  transition: "bounceIn" as const,
  icon: "",
  sound: false,
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores sin Clipboard API o fuera de contexto seguro.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export default function ShareButton({ productId, productName }: ShareButtonProps) {
  // Siempre la URL canónica: sin filtros ni parámetros de la sesión actual.
  const url = `${SITE_URL}/products/${productId}`;
  const text = `Mirá ${productName} en ${SITE_NAME}`;

  // navigator.share solo existe en el cliente: se detecta después de montar
  // para no desalinear el HTML del servidor con el de la hidratación.
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const nativeShare = async () => {
    try {
      await navigator.share({ title: productName, text, url });
    } catch {
      // El usuario cerró el menú de compartir: no es un error.
    }
  };

  const copyLink = async (message = "¡Link copiado!") => {
    const ok = await copyToClipboard(url);
    if (ok) showToast.success(message, toastOptions);
    else showToast.error("No se pudo copiar el link", toastOptions);
  };

  // Instagram no tiene URL para compartir desde la web: en el celular se usa el
  // menú nativo (incluye Instagram Direct e Historias); en desktop se copia el link.
  const shareInstagram = () =>
    canNativeShare
      ? nativeShare()
      : copyLink("Link copiado: pegalo en un mensaje o historia de Instagram");

  const options: {
    value: string;
    label: string;
    icon: ReactNode;
    color: string;
    href?: string;
    onClick?: () => void;
  }[] = [
    {
      value: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp />,
      color: "#25D366",
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      value: "instagram",
      label: "Instagram",
      icon: <FaInstagram />,
      color: "#E4405F",
      onClick: shareInstagram,
    },
    {
      value: "facebook",
      label: "Facebook",
      icon: <FaFacebook />,
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      value: "x",
      label: "X (Twitter)",
      icon: <FaXTwitter />,
      color: "aoe.text",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
  ];

  const itemProps = {
    color: "aoe.text",
    cursor: "pointer",
    fontSize: "14px",
    py: 2,
    _hover: { bg: "aoe.surface" },
    _highlighted: { bg: "aoe.surface" },
  };

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Compartir producto"
          size="sm"
          variant="outline"
          borderRadius="pill"
          borderColor="aoe.borderControl"
          bg="aoe.chip"
          color="aoe.text"
          _hover={{ borderColor: "aoe.red" }}
          _expanded={{ borderColor: "aoe.red" }}
        >
          <FiShare2 />
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content
            bg="aoe.bgAlt"
            borderColor="aoe.borderSubtle"
            borderWidth="1px"
            color="aoe.text"
            minW="220px"
          >
            <Text
              px={3}
              pt={2}
              pb={1}
              fontFamily="mono"
              fontSize="10px"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="aoe.textFaint"
            >
              Compartir
            </Text>

            {options.map((o) => {
              const content = (
                <HStack gap={3}>
                  <Text as="span" color={o.color} fontSize="18px">{o.icon}</Text>
                  {o.label}
                </HStack>
              );
              return o.href ? (
                <Menu.Item key={o.value} value={o.value} asChild {...itemProps}>
                  <a href={o.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                </Menu.Item>
              ) : (
                <Menu.Item key={o.value} value={o.value} onClick={o.onClick} {...itemProps}>
                  {content}
                </Menu.Item>
              );
            })}

            <Menu.Separator borderColor="aoe.borderSubtle" />

            <Menu.Item value="copy" onClick={() => copyLink()} {...itemProps}>
              <HStack gap={3}>
                <Text as="span" color="aoe.textMuted" fontSize="18px"><FiLink /></Text>
                Copiar link
              </HStack>
            </Menu.Item>

            {canNativeShare && (
              <Menu.Item value="native" onClick={nativeShare} {...itemProps}>
                <HStack gap={3}>
                  <Text as="span" color="aoe.textMuted" fontSize="18px"><FiMoreHorizontal /></Text>
                  Más opciones…
                </HStack>
              </Menu.Item>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
