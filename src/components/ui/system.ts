import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        aoe: {
          bg: { value: "#0a0a0a" },
          bgAlt: { value: "#0d0d0d" },
          surface: { value: "#141414" },
          tile: { value: "#101010" },
          field: { value: "#0f0f0f" },
          chip: { value: "#111111" },
          borderSubtle: { value: "#1f1f1f" },
          borderControl: { value: "#262626" },
          borderHover: { value: "#333333" },
          text: { value: "#f5f5f5" },
          textMuted: { value: "#a3a3a3" },
          textSubtle: { value: "#8c8c8c" },
          textFaint: { value: "#737373" },
          textGhost: { value: "#6b6b6b" },
          textDisabled: { value: "#3d3d3d" },
          red: { value: "#e11d2e" },
          green: { value: "#6ee7a8" },
          amber: { value: "#fbbf24" },
        },
      },
      fonts: {
        heading: { value: "var(--font-anton), Impact, sans-serif" },
        body: { value: "var(--font-archivo), Helvetica, Arial, sans-serif" },
        mono: { value: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace" },
      },
      radii: {
        pill: { value: "999px" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
