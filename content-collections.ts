import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: (document) => {
    return {
      ...document,
      slug: document._meta.path.replace(/\.md$/, ""),
    };
  },
});

export default defineConfig({
  content: [pages],
});
