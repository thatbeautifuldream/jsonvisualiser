import merge from "deepmerge";
import type { Metadata } from "next";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
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
          url: "https://dqy38fnwh4fqs.cloudfront.net/scroll/UHDNGKG7BMJ8PKPFNLPRDDRNOAG7-1753640125899",
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
          url: "https://dqy38fnwh4fqs.cloudfront.net/scroll/UHDNGKG7BMJ8PKPFNLPRDDRNOAG7-1753640125899",
          width: 1200,
          height: 630,
        },
      ],
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  return metadata;
};
