"use client";

import { JsonExplanation } from "@/components/json-explanation";
import { JsonGrid } from "@/components/json-grid";
import { JsonHeader } from "@/components/json-header";
import { JsonInput } from "@/components/json-input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchSharedJson } from "@/lib/services/share";
import {
  TabValue,
  useJsonVisualizerStore,
} from "@/lib/stores/json-visualizer-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { JsonTree } from "./json-tree";

interface JsonVisualizerProps {
  initialShareId?: string;
}

export function JsonVisualizer({ initialShareId }: JsonVisualizerProps) {
  const {
    activeTab,
    jsonInput,
    parsedJson,
    error,
    setActiveTab,
    setJsonInput,
    setParsedJson,
    setError,
  } = useJsonVisualizerStore();

  const { data, isLoading, isSuccess, isError } = useQuery({
    enabled: !!initialShareId,
    queryKey: ["sharedJson", initialShareId],
    queryFn: () => fetchSharedJson(initialShareId || ""),
  });

  useEffect(() => {
    if (isSuccess && data?.json) {
      setJsonInput(data.json);
      try {
        const parsed = JSON.parse(data.json);
        setParsedJson(parsed);
        setError(null);
      } catch {
        setError("Invalid JSON format");
      }
    }
    if (isError) {
      setError("Error fetching shared JSON");
    }
  }, [isSuccess, isError, data, setJsonInput, setParsedJson, setError]);

  const handleJsonInputChange = (value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
      setError(null);
    } catch {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="flex-grow flex flex-col"
      >
        <JsonHeader
          setActiveTab={setActiveTab}
          initialShareId={initialShareId}
          jsonInput={jsonInput}
          parsedJson={parsedJson}
          error={error}
        />
        <div className="flex-grow flex flex-col">
          <TabsContent value="input" className="flex-grow p-4">
            {isSuccess ? (
              <JsonInput
                jsonInput={jsonInput}
                setJsonInput={handleJsonInputChange}
                isSharedJson={!!initialShareId}
                sharedJsonMetadata={data.metadata}
                isSharedJsonLoading={isLoading}
              />
            ) : (
              <JsonInput
                jsonInput={jsonInput}
                setJsonInput={handleJsonInputChange}
                isSharedJson={false}
              />
            )}
          </TabsContent>
          <TabsContent value="tree" className="flex-grow p-4">
            {parsedJson && <JsonTree parsedJson={parsedJson} error={error} />}
          </TabsContent>
          <TabsContent value="grid" className="flex-grow p-4">
            {parsedJson && <JsonGrid data={parsedJson} error={error} />}
          </TabsContent>
          <TabsContent value="ai" className="flex-grow p-4">
            {parsedJson && <JsonExplanation jsonData={parsedJson} />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
