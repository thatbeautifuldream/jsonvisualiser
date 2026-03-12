"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ExternalLink, LoaderCircle } from "lucide-react";
import { JsonWorkspace } from "./json-workspace";
import { useJsonStore } from "@/stores/json-document-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const FALLBACK_DELAY_MS = 1500;

type TExtensionLoadPayload = {
  sourceUrl: string;
  jsonText: string;
  contentType?: string | null;
  detectedAt?: string;
  version: 1;
};

type TExtensionLoadMessage = {
  type: "JSON_VISUALISER_LOAD";
  payload: TExtensionLoadPayload;
};

type TExtensionReadyMessage = {
  type: "JSON_VISUALISER_READY";
  payload: {
    version: 1;
  };
};

const isValidPayload = (
  payload: unknown,
): payload is TExtensionLoadPayload => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    typeof candidate.sourceUrl === "string" &&
    candidate.sourceUrl.length > 0 &&
    typeof candidate.jsonText === "string" &&
    (candidate.contentType === undefined ||
      candidate.contentType === null ||
      typeof candidate.contentType === "string") &&
    (candidate.detectedAt === undefined ||
      typeof candidate.detectedAt === "string")
  );
};

const isValidMessage = (
  data: unknown,
): data is TExtensionLoadMessage => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const candidate = data as Record<string, unknown>;
  return (
    candidate.type === "JSON_VISUALISER_LOAD" &&
    isValidPayload(candidate.payload)
  );
};

export function ExtensionPageClient() {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [hasAcceptedPayload, setHasAcceptedPayload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const metadata = useJsonStore((state) => state.metadata);
  const hasContent = useJsonStore((state) => state.hasContent());
  const loadJsonDocument = useJsonStore((state) => state.loadJsonDocument);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setHasTimedOut(true);
    }, FALLBACK_DELAY_MS);

    const readyMessage: TExtensionReadyMessage = {
      type: "JSON_VISUALISER_READY",
      payload: {
        version: 1,
      },
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) {
        return;
      }

      if (!isValidMessage(event.data)) {
        return;
      }

      const { payload } = event.data;

      try {
        JSON.parse(payload.jsonText);
      } catch (parseError) {
        setError(
          parseError instanceof Error
            ? parseError.message
            : "Received invalid JSON payload.",
        );
        return;
      }

      void loadJsonDocument({
        content: payload.jsonText,
        source: "extension",
        sourceUrl: payload.sourceUrl,
        contentType: payload.contentType ?? null,
        persist: true,
      });

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setError(null);
      setHasAcceptedPayload(true);
      setHasTimedOut(false);
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage(readyMessage, "*");

    return () => {
      window.removeEventListener("message", onMessage);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [loadJsonDocument]);

  const isWaitingForPayload = !hasAcceptedPayload && !hasTimedOut && !error;
  const canRenderWorkspace = hasAcceptedPayload || hasTimedOut;

  const sourceDetails = useMemo(() => {
    if (!metadata.sourceUrl) {
      return {
        hostname: "Waiting for source",
        href: null,
      };
    }

    try {
      const url = new URL(metadata.sourceUrl);
      return {
        hostname: url.hostname,
        href: metadata.sourceUrl,
      };
    } catch {
      return {
        hostname: metadata.sourceUrl,
        href: metadata.sourceUrl,
      };
    }
  }, [metadata.sourceUrl]);

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Could not open extension payload</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button asChild className="w-fit" variant="outline">
            <Link href="/">Open the standard editor</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (isWaitingForPayload) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <Alert>
            <LoaderCircle className="animate-spin" />
            <AlertTitle>Waiting for JSON payload</AlertTitle>
            <AlertDescription>
              The extension will send the current page&apos;s JSON here once the
              iframe is ready.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <div className="border-b border-border/70 bg-background/95 px-4 py-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Extension
            </span>
            <span
              className="truncate font-medium text-foreground"
              title={metadata.sourceUrl ?? undefined}
            >
              {sourceDetails.hostname}
            </span>
            {metadata.contentType ? (
              <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {metadata.contentType}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {sourceDetails.href ? (
              <Button asChild size="xs" variant="outline">
                <a
                  href={sourceDetails.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Original
                  <ExternalLink />
                </a>
              </Button>
            ) : null}
            <Button asChild size="xs" variant="ghost">
              <Link href="/">Open Main App</Link>
            </Button>
          </div>
        </div>
      </div>
      {canRenderWorkspace ? (
        <JsonWorkspace
          mode="extension"
          onOpenOriginal={
            sourceDetails.href
              ? () => {
                  window.open(sourceDetails.href, "_blank", "noopener,noreferrer");
                }
              : undefined
          }
          shouldLoadPersistedState={!hasAcceptedPayload}
        />
      ) : null}
      {!hasAcceptedPayload && hasTimedOut && !hasContent ? (
        <div className="pointer-events-none absolute inset-x-4 top-20 z-20">
          <Alert className="mx-auto max-w-3xl">
            <AlertCircle />
            <AlertTitle>No extension payload received</AlertTitle>
            <AlertDescription>
              Falling back to any persisted editor state for this tab.
            </AlertDescription>
          </Alert>
        </div>
      ) : null}
    </main>
  );
}
