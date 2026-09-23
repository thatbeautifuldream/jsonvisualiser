import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared Open Graph card, matching the portfolio's card.
export async function ogImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [regular, medium] = await Promise.all(
    ["Inter-400.ttf", "Inter-500.ttf"].map((file) =>
      readFile(join(process.cwd(), "assets/fonts", file)),
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 96,
          backgroundColor: "#fdfdfc",
          fontFamily: "Inter",
          fontSize: 44,
          lineHeight: 1.35,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 32, width: 912 }}>
          <div style={{ color: "#111111", fontWeight: 500 }}>{title}</div>
          <div style={{ color: "rgb(152, 152, 151)", fontWeight: 400 }}>
            {description}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
