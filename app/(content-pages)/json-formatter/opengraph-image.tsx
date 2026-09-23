import { allPages } from "content-collections";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  const page = allPages.find((p) => p.slug === "json-formatter");
  return ogImage({
    title: page?.title ?? "JSON Visualiser",
    description: page?.description ?? "",
  });
}
