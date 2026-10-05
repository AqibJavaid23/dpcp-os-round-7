import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dental Practice Copilot OS",
    short_name: "DPCP OS",
    description: "Daily operating app for Dental Practice Copilot.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0B254B",
    icons: [
      {
        src: "/brand/logos/app-icons/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/logos/app-icons/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/brand/logos/app-icons/pwa-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
