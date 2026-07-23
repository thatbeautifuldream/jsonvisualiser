import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JSON Visualiser",
    short_name: "JSON Visualiser",
    description:
      "Visualize, validate, and format JSON data with tree view.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "2560x1440",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "780x1688",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
