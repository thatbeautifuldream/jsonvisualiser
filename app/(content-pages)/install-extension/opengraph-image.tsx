import { ogImage, ogSize } from "@/lib/og";

export const alt = "Install JSON Visualiser Chrome extension";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: "JSON Visualiser for Chrome",
    description: "Open raw JSON responses in a cleaner workspace.",
  });
}
