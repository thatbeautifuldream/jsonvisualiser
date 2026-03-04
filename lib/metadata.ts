import merge from "deepmerge";
import type { Metadata } from "next";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
};

const applicationName = "JSON Visualiser";
const author: Metadata["authors"] = {
  name: "Milind Mishra",
  url: "https://milindmishra.com/",
};
const publisher = "Milind Mishra";
const twitterHandle = "@milindmishra_";

export const createMetadata = ({
  title,
  description,
  image,
  canonical,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${applicationName}`;

  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description,
    applicationName,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
      images: [
        {
          url: "https://cdn.milind.app/media/og/json-visualiser.webp",
          width: 1200,
          height: 630,
        },
      ],
    },
    publisher,
    twitter: {
      title: parsedTitle,
      description,
      creatorId: twitterHandle,
      card: "summary_large_image",
      creator: twitterHandle,
      images: [
        {
          url: "https://cdn.milind.app/media/og/json-visualiser.webp",
          width: 1200,
          height: 630,
        },
      ],
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (canonical) {
    metadata.alternates = {
      canonical,
    };
  }

  return metadata;
};
