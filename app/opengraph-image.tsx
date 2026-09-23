import { ogImage, ogSize } from "@/lib/og";

export const alt = "JSON Visualiser";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    title: "JSON Visualiser",
    description: "Visualize, validate, and format JSON with tree view.",
  });
}
