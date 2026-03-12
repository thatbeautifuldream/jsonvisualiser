"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JsonWorkspace } from "./json-workspace";
import { useJsonStore } from "@/stores/json-document-store";
import { toast } from "sonner";

const FALLBACK_DELAY_MS = 1500;
const STREAM_STALL_TIMEOUT_MS = 15000;
const STATUS_TOAST_ID = "extension-payload-status";

type TExtensionLoadPayload = {
  sourceUrl: string;
  jsonText: string;
  contentType?: string | null;
  detectedAt?: string;
  version: 1;
};

type TExtensionReadyMessage = {
  type: "JSON_VISUALISER_READY";
  payload: {
    version: 1;
  };
};

type TExtensionPortPayload = {
  version: 1;
  transferId: string;
  sourceUrl: string;
  contentType?: string | null;
  detectedAt?: string;
  totalChunks: number;
  totalCharacters: number;
};

type TExtensionPortMessage = {
  type: "JSON_VISUALISER_PORT";
  payload: TExtensionPortPayload;
};

type TExtensionChunkMessage = {
  type: "JSON_VISUALISER_CHUNK";
  payload: {
    index: number;
    chunk: string;
  };
};

type TExtensionCompleteMessage = {
  type: "JSON_VISUALISER_COMPLETE";
};

type TExtensionAbortMessage = {
  type: "JSON_VISUALISER_ABORT";
  payload?: {
    reason?: string;
  };
};

type TExtensionAckMessage = {
  type: "JSON_VISUALISER_ACK";
  payload: {
    index: number;
  };
};

type TExtensionDirectLoadMessage = {
  type: "JSON_VISUALISER_LOAD";
  payload: TExtensionLoadPayload;
};

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object";
};

const isDirectLoadPayload = (
  payload: unknown,
): payload is TExtensionLoadPayload => {
  if (!isObjectRecord(payload)) {
    return false;
  }

  return (
    payload.version === 1 &&
    typeof payload.sourceUrl === "string" &&
    payload.sourceUrl.length > 0 &&
    typeof payload.jsonText === "string" &&
    (payload.contentType === undefined ||
      payload.contentType === null ||
      typeof payload.contentType === "string") &&
    (payload.detectedAt === undefined || typeof payload.detectedAt === "string")
  );
};

const isDirectLoadMessage = (
  data: unknown,
): data is TExtensionDirectLoadMessage => {
  if (!isObjectRecord(data)) {
    return false;
  }

  return (
    data.type === "JSON_VISUALISER_LOAD" && isDirectLoadPayload(data.payload)
  );
};

const isPortPayload = (payload: unknown): payload is TExtensionPortPayload => {
  if (!isObjectRecord(payload)) {
    return false;
  }

  return (
    payload.version === 1 &&
    typeof payload.transferId === "string" &&
    payload.transferId.length > 0 &&
    typeof payload.sourceUrl === "string" &&
    payload.sourceUrl.length > 0 &&
    typeof payload.totalChunks === "number" &&
    payload.totalChunks > 0 &&
    typeof payload.totalCharacters === "number" &&
    payload.totalCharacters >= 0 &&
    (payload.contentType === undefined ||
      payload.contentType === null ||
      typeof payload.contentType === "string") &&
    (payload.detectedAt === undefined || typeof payload.detectedAt === "string")
  );
};

const isPortMessage = (data: unknown): data is TExtensionPortMessage => {
  if (!isObjectRecord(data)) {
    return false;
  }

  return data.type === "JSON_VISUALISER_PORT" && isPortPayload(data.payload);
};

const getSourceHost = (sourceUrl: string) => {
  try {
    return new URL(sourceUrl).hostname;
  } catch {
    return sourceUrl;
  }
};

export function ExtensionPageClient() {
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [hasAcceptedPayload, setHasAcceptedPayload] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const stallTimeoutRef = useRef<number | null>(null);
  const hasShownFallbackToastRef = useRef(false);
  const activePortRef = useRef<MessagePort | null>(null);

  const metadata = useJsonStore((state) => state.metadata);
  const loadJsonDocument = useJsonStore((state) => state.loadJsonDocument);

  useEffect(() => {
    const clearFallbackTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const resetStallTimer = (onStall: () => void) => {
      if (stallTimeoutRef.current !== null) {
        window.clearTimeout(stallTimeoutRef.current);
      }

      stallTimeoutRef.current = window.setTimeout(
        onStall,
        STREAM_STALL_TIMEOUT_MS,
      );
    };

    const clearStallTimer = () => {
      if (stallTimeoutRef.current !== null) {
        window.clearTimeout(stallTimeoutRef.current);
        stallTimeoutRef.current = null;
      }
    };

    const closeActivePort = () => {
      activePortRef.current?.close();
      activePortRef.current = null;
    };

    const failTransfer = (title: string, description: string) => {
      clearFallbackTimer();
      clearStallTimer();
      closeActivePort();
      toast.error(title, {
        id: STATUS_TOAST_ID,
        description,
      });
      setHasTimedOut(true);
      setHasAcceptedPayload(false);
    };

    const acceptPayload = async (payload: TExtensionLoadPayload) => {
      try {
        JSON.parse(payload.jsonText);
      } catch (parseError) {
        failTransfer(
          "Payload failed",
          parseError instanceof Error
            ? parseError.message
            : "Invalid JSON payload.",
        );
        return;
      }

      await loadJsonDocument({
        content: payload.jsonText,
        source: "extension",
        sourceUrl: payload.sourceUrl,
        contentType: payload.contentType ?? null,
        persist: true,
      });

      clearFallbackTimer();
      clearStallTimer();
      closeActivePort();

      toast.success(`Loaded ${getSourceHost(payload.sourceUrl)}`, {
        id: STATUS_TOAST_ID,
        description: payload.contentType ?? "JSON is ready.",
      });

      setHasAcceptedPayload(true);
      setHasTimedOut(false);
    };

    timeoutRef.current = window.setTimeout(() => {
      setHasTimedOut(true);
    }, FALLBACK_DELAY_MS);

    toast.loading("Waiting for payload", {
      id: STATUS_TOAST_ID,
      description: "Waiting for page data.",
    });

    const readyMessage: TExtensionReadyMessage = {
      type: "JSON_VISUALISER_READY",
      payload: {
        version: 1,
      },
    };

    const onWindowMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) {
        return;
      }

      if (isDirectLoadMessage(event.data)) {
        void acceptPayload(event.data.payload);
        return;
      }

      if (!isPortMessage(event.data)) {
        return;
      }

      const port = event.ports[0];
      if (!port) {
        failTransfer("Transfer failed", "No data channel.");
        return;
      }

      clearFallbackTimer();
      clearStallTimer();
      closeActivePort();
      activePortRef.current = port;

      const transfer = event.data.payload;
      const chunks = new Array<string>(transfer.totalChunks);
      let expectedIndex = 0;

      toast.loading(`Receiving ${getSourceHost(transfer.sourceUrl)}`, {
        id: STATUS_TOAST_ID,
        description: `${transfer.totalChunks} chunks queued.`,
      });

      const onStall = () => {
        port.postMessage({
          type: "JSON_VISUALISER_ABORT",
          payload: {
            reason: "Stream stalled.",
          },
        } satisfies TExtensionAbortMessage);
        failTransfer("Transfer stalled", "Stream timed out.");
      };

      resetStallTimer(onStall);

      port.onmessage = (portEvent: MessageEvent) => {
        const data = portEvent.data;

        if (!isObjectRecord(data) || typeof data.type !== "string") {
          failTransfer("Transfer failed", "Bad chunk data.");
          return;
        }

        if (data.type === "JSON_VISUALISER_CHUNK") {
          const chunkMessage = data as TExtensionChunkMessage;
          if (
            !isObjectRecord(chunkMessage.payload) ||
            typeof chunkMessage.payload.index !== "number" ||
            typeof chunkMessage.payload.chunk !== "string"
          ) {
            failTransfer("Transfer failed", "Bad chunk data.");
            return;
          }

          if (chunkMessage.payload.index !== expectedIndex) {
            failTransfer("Transfer failed", "Chunk order broke.");
            return;
          }

          chunks[expectedIndex] = chunkMessage.payload.chunk;
          port.postMessage({
            type: "JSON_VISUALISER_ACK",
            payload: {
              index: expectedIndex,
            },
          } satisfies TExtensionAckMessage);
          expectedIndex += 1;
          resetStallTimer(onStall);
          return;
        }

        if (data.type === "JSON_VISUALISER_COMPLETE") {
          if (expectedIndex !== transfer.totalChunks) {
            failTransfer("Transfer failed", "Payload was incomplete.");
            return;
          }

          const jsonText = chunks.join("");
          if (jsonText.length !== transfer.totalCharacters) {
            failTransfer("Transfer failed", "Payload size changed.");
            return;
          }

          void acceptPayload({
            version: 1,
            sourceUrl: transfer.sourceUrl,
            jsonText,
            contentType: transfer.contentType ?? null,
            detectedAt: transfer.detectedAt,
          });
          return;
        }

        if (data.type === "JSON_VISUALISER_ABORT") {
          failTransfer("Transfer failed", "Stream was cancelled.");
        }
      };

      port.start();
    };

    window.addEventListener("message", onWindowMessage);
    window.parent.postMessage(readyMessage, "*");

    return () => {
      window.removeEventListener("message", onWindowMessage);
      clearFallbackTimer();
      clearStallTimer();
      closeActivePort();
      toast.dismiss(STATUS_TOAST_ID);
    };
  }, [loadJsonDocument]);

  useEffect(() => {
    if (
      hasAcceptedPayload ||
      !hasTimedOut ||
      hasShownFallbackToastRef.current
    ) {
      return;
    }

    hasShownFallbackToastRef.current = true;
    toast.warning("No payload received", {
      id: STATUS_TOAST_ID,
      description: "Using saved tab state.",
    });
  }, [hasAcceptedPayload, hasTimedOut]);

  const sourceDetails = useMemo(() => {
    if (!metadata.sourceUrl) {
      return {
        href: null,
      };
    }

    return {
      href: metadata.sourceUrl,
    };
  }, [metadata.sourceUrl]);

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <JsonWorkspace
        mode="extension"
        onOpenOriginal={
          sourceDetails.href
            ? () => {
                window.open(
                  sourceDetails.href,
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            : undefined
        }
        onOpenMainApp={() => {
          window.open("/", "_blank", "noopener,noreferrer");
        }}
        shouldLoadPersistedState={hasTimedOut && !hasAcceptedPayload}
      />
    </main>
  );
}
