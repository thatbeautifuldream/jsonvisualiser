"use client";
import { useState, useMemo } from "react";
import { GraphView } from "./graph-view";
import { jsonToGraph, presets, type TJsonToGraphOptions } from "@/lib/json-to-graph";
import { cn } from "@/lib/utils";

export type TJsonGraphViewerProps = {
  data: any;
  options?: TJsonToGraphOptions;
  preset?: keyof typeof presets;
  height?: number;
  onNodeClick?: (node: any, path: string[]) => void;
  className?: string;
};

export function JsonGraphViewer({ 
  data, 
  options = {}, 
  preset, 
  height = 600, 
  onNodeClick,
  className 
}: TJsonGraphViewerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Apply preset if specified
  const finalOptions = useMemo(() => {
    if (preset && presets[preset]) {
      return { ...presets[preset], ...options };
    }
    return options;
  }, [preset, options]);

  const graph = useMemo(() => {
    try {
      return jsonToGraph(data, finalOptions);
    } catch (error) {
      console.error("Error converting JSON to graph:", error);
      return { nodes: [], links: [] };
    }
  }, [data, finalOptions]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node.id);
    if (onNodeClick) {
      const path = node.id.split(".");
      onNodeClick(node, path);
    }
  };

  const handleNodeHover = (node: any) => {
    // Could add hover effects here if needed
  };

  return (
    <div className={cn("relative w-full h-full bg-background", className)}>
      {/* Top left metadata */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <span>Nodes: {graph.nodes.length}</span>
          <span>•</span>
          <span>Links: {graph.links.length}</span>
          {selectedNode && (
            <>
              <span>•</span>
              <span>Selected: {selectedNode}</span>
            </>
          )}
        </div>
      </div>

      <GraphView
        graph={graph}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        enableNavigation={false}
        className="w-full h-full"
      />
    </div>
  );
}