"use client";
import { lazy, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import type { ForceGraphMethods, ForceGraphProps, LinkObject, NodeObject } from "react-force-graph-2d";
import { forceCollide, forceLink, forceManyBody } from "d3-force";
import { cn } from "@/lib/utils";

export type TGraph = {
  links: TLink[];
  nodes: TNode[];
};

export type TNodeType = {
  text: string;
  description?: string;
  neighbors?: string[];
  url?: string;
  [key: string]: any; // Allow any additional properties for generic JSON data
};

export type TNode = NodeObject<TNodeType>;
export type TLink = LinkObject<TNodeType, TLinkType>;

export type TLinkType = Record<string, unknown>;

export type TGraphViewProps = {
  graph: TGraph;
  onNodeClick?: (node: TNode) => void;
  onNodeHover?: (node: TNode | null) => void;
  height?: number;
  enableNavigation?: boolean;
  className?: string;
};

const ForceGraph2D = lazy(() => import("react-force-graph-2d")) as typeof import("react-force-graph-2d").default;

export function GraphView(props: TGraphViewProps) {
  const { className } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  
  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div 
      ref={ref} 
      className={cn("relative w-full h-full overflow-hidden bg-background", className)}
    >
      <div className="[&_canvas]:size-full">
        {mount && <ClientOnly {...props} containerRef={ref} />}
      </div>
    </div>
  );
}

function ClientOnly({
  containerRef,
  graph: { nodes, links },
  onNodeClick,
  onNodeHover,
  enableNavigation = false,
}: TGraphViewProps & { containerRef: RefObject<HTMLDivElement | null> }) {
  const fgRef = useRef<ForceGraphMethods<TNode, TLink> | undefined>(undefined);
  const hoveredRef = useRef<TNode | null>(null);
  const readyRef = useRef(false);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    if (readyRef.current) return;
    readyRef.current = true;

    fg.d3Force("link", forceLink().distance(200));
    fg.d3Force("charge", forceManyBody().strength(1));
    fg.d3Force("collision", forceCollide(60));
  });

  const handleNodeHover = (node: TNode | null) => {
    const graph = fgRef.current;
    if (!graph) return;
    hoveredRef.current = node;

    if (onNodeHover) {
      onNodeHover(node);
    }

    if (node) {
      const coords = graph.graph2ScreenCoords(node.x!, node.y!);
      setTooltip({
        x: coords.x + 4,
        y: coords.y + 4,
        content: node.description ?? "No description",
      });
    } else {
      setTooltip(null);
    }
  };

  const linkColor = (link: TLink) => {
    const container = containerRef.current;
    if (!container) return "#999";
    const style = getComputedStyle(container);
    const hoverNode = hoveredRef.current;

    if (
      hoverNode &&
      typeof link.source === "object" &&
      typeof link.target === "object" &&
      (hoverNode.id === link.source.id || hoverNode.id === link.target.id)
    ) {
      return style.getPropertyValue("--color-primary") || "#3b82f6";
    }

    return style.getPropertyValue("--color-muted-foreground") || "#6b7280";
  };

  const nodeCanvasObject: ForceGraphProps["nodeCanvasObject"] = (node, ctx) => {
    const container = containerRef.current;
    if (!container) return;
    const style = getComputedStyle(container);
    const fontSize = 12;
    const radius = 6;

    ctx.beginPath();
    ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);

    const hoverNode = hoveredRef.current;
    const isActive = hoverNode?.id === node.id || hoverNode?.neighbors?.includes(node.id as string);

    ctx.fillStyle = isActive
      ? style.getPropertyValue("--color-primary") || "#3b82f6"
      : style.getPropertyValue("--color-secondary") || "#d8b4fe";
    ctx.fill();

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = style.getPropertyValue("--color-foreground") || "#000";

    const maxLength = 15;
    const displayText = node.text.length > maxLength ? node.text.slice(0, maxLength) + "..." : node.text;

    ctx.fillText(displayText, node.x!, node.y! + radius + fontSize);
  };

  const enrichedNodes = useMemo(() => {
    const enrichedNodes = nodes.map((node) => ({
      ...node,
      neighbors: links.flatMap((link) => {
        if (link.source === node.id) return link.target;
        if (link.target === node.id) return link.source;
        return [];
      }),
    }));

    return { nodes: enrichedNodes as TNode[], links };
  }, [nodes, links]);

  return (
    <>
      <ForceGraph2D
        ref={fgRef}
        graphData={enrichedNodes}
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        onNodeHover={handleNodeHover}
        onNodeClick={(node) => {
          if (onNodeClick) {
            onNodeClick(node);
          } else if (enableNavigation && node.url) {
            window.open(node.url, "_blank");
          }
        }}
        linkWidth={2}
        enableNodeDrag
        enableZoomInteraction
      />
      {tooltip && (
        <div
          className="absolute bg-white dark:bg-gray-800 text-black dark:text-white p-2 border rounded-xl shadow-lg text-sm max-w-xs z-10"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <pre className="whitespace-pre-wrap text-xs">{tooltip.content}</pre>
        </div>
      )}
    </>
  );
}