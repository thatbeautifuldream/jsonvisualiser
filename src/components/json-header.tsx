"use client";

import { ShareDialog } from "@/components/share-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabValue } from "@/lib/stores/json-visualizer-store";
import {
  Code2Icon,
  Github,
  LayoutGridIcon,
  ListTree,
  SparklesIcon,
  Braces,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

type TJsonHeaderProps = {
  setActiveTab: (value: TabValue) => void;
  initialShareId?: string;
  jsonInput: string;
  parsedJson: any;
  error: string | null;
};

export function JsonHeader({
  setActiveTab,
  initialShareId,
  jsonInput,
  parsedJson,
  error,
}: TJsonHeaderProps) {
  return (
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
              onClick={() => setActiveTab("input")}
            >
              <Code2Icon
                className="-ms-0.5 sm:me-1.5"
                size={16}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Input</span>
            </TabsTrigger>
            <TabsTrigger
              value="tree"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
              onClick={() => setActiveTab("tree")}
              disabled={!parsedJson}
            >
              <ListTree
                className="-ms-0.5 sm:me-1.5"
                size={16}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Tree</span>
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
              onClick={() => setActiveTab("grid")}
              disabled={!parsedJson}
            >
              <LayoutGridIcon
                className="-ms-0.5 sm:me-1.5"
                size={16}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Grid</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:text-gray-300"
              onClick={() => setActiveTab("ai")}
              disabled={!parsedJson}
            >
              <SparklesIcon
                className="-ms-0.5 sm:me-1.5"
                size={16}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex items-center space-x-0">
        {!initialShareId && parsedJson && !error && (
          <ShareDialog jsonInput={jsonInput} />
        )}
        <Button
          variant="ghost"
          size="xs"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={() =>
            window.open(
              "https://github.com/thatbeautifuldream/jsonvisualiser",
              "_blank"
            )
          }
        >
          <Github className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">jsonvisualiser</span>
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
