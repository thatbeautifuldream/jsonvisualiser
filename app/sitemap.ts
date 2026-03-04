import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { allPages } from "content-collections";
import { siteConfig } from "@/lib/config";

const baseUrl = siteConfig.website;
const appDir = path.join(process.cwd(), "app");

function getAllRoutes(): string[] {
  const routes: string[] = [];

  function scanDirectory(dir: string, currentPath: string = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith("(") || entry.name.startsWith("_")) {
        continue;
      }

      if (entry.isDirectory()) {
        scanDirectory(
          path.join(dir, entry.name),
          path.join(currentPath, entry.name),
        );
      } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
        routes.push(currentPath === "" ? "/" : `/${currentPath}`);
      }
    }
  }

  scanDirectory(appDir);
  return routes;
}

function getLastModified(filePath: string): Date {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = getAllRoutes();

  const staticSitemap: MetadataRoute.Sitemap = routes.map((route) => {
    let pagePath: string;
    if (route === "/") {
      pagePath = path.join(appDir, "page.tsx");
    } else {
      pagePath = path.join(appDir, route.slice(1), "page.tsx");
    }

    const lastModified = getLastModified(pagePath);

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.8,
    };
  });

  const contentSitemap: MetadataRoute.Sitemap = allPages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const combined = [...staticSitemap, ...contentSitemap];
  const uniqueByUrl = new Map();

  combined.forEach((item) => {
    if (!uniqueByUrl.has(item.url)) {
      uniqueByUrl.set(item.url, item);
    }
  });

  return Array.from(uniqueByUrl.values());
}
