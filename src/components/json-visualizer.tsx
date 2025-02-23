"use client";

import { JsonExplanation } from "@/components/json-explanation";
import { JsonGrid } from "@/components/json-grid";
import { JsonInput } from "@/components/json-input";
import { ModeToggle } from "@/components/mode-toggle";
import { ShareDialog } from "@/components/share-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSharedJson } from "@/lib/services/share";
import {
  TabValue,
  useJsonVisualizerStore,
} from "@/lib/stores/json-visualizer-store";
import { useQuery } from "@tanstack/react-query";
import {
  Braces,
  Code2Icon,
  Github,
  LayoutGridIcon,
  ListTree,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
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
        <div className="bg-gray-100 dark:bg-black px-4 flex items-center justify-between shadow-sm h-14">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-md font-bold text-gray-800 dark:text-white"
            >
              <div className="block sm:hidden">
                <Braces className="w-4 h-4" />
              </div>
              <span className="hidden sm:block">JSON Visualiser</span>
            </Link>
            <ScrollArea className="h-14">
              <TabsList className="text-foreground h-14 gap-2 rounded-none bg-transparent px-0">
                <TabsTrigger
                  value="input"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
                >
                  <Code2Icon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Input
                </TabsTrigger>
                <TabsTrigger
                  value="tree"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
                >
                  <ListTree
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Tree
                </TabsTrigger>
                <TabsTrigger
                  value="grid"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
                >
                  <LayoutGridIcon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
                >
                  <SparklesIcon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  AI
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="flex items-center space-x-0">
            {!initialShareId && <ShareDialog jsonInput={jsonInput} />}
            <Button
              variant="ghost"
              size="xs"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() =>
                window.open(
                  "https://github.com/thatbeautifuldream/json-visualizer",
                  "_blank"
                )
              }
            >
              <Github className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">json-visualizer</span>
            </Button>
            <ModeToggle />
          </div>
        </div>
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
