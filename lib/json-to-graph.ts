import type { TGraph, TNode, TLink } from "@/components/graph-view";

export type TJsonToGraphOptions = {
  getNodeText?: (key: string, value: any, path: string[]) => string;
  getNodeDescription?: (key: string, value: any, path: string[]) => string;
  getNodeUrl?: (key: string, value: any, path: string[]) => string;
  maxDepth?: number;
  createHierarchicalLinks?: boolean;
  createArrayLinks?: boolean;
  shouldLink?: (node1: any, node2: any, path1: string[], path2: string[]) => boolean;
};

export function jsonToGraph(data: any, options: TJsonToGraphOptions = {}): TGraph {
  const {
    getNodeText = (key, value, path) => key || String(value).slice(0, 20),
    getNodeDescription = (key, value) =>
      typeof value === "object" ? JSON.stringify(value, null, 2).slice(0, 200) + "..." : String(value),
    getNodeUrl = () => "#",
    maxDepth = 3,
    createHierarchicalLinks = true,
    createArrayLinks = false,
    shouldLink,
  } = options;

  const nodes: TNode[] = [];
  const links: TLink[] = [];
  const nodeMap = new Map<string, TNode>();

  function createNodeId(path: string[]): string {
    return path.join(".");
  }

  function traverse(obj: any, path: string[] = [], parentId?: string, depth = 0): void {
    if (depth > maxDepth) return;

    if (obj === null || obj === undefined) return;

    const currentId = createNodeId(path);
    const key = path[path.length - 1] || "root";

    // Create node if it doesn't exist
    if (!nodeMap.has(currentId)) {
      const node: TNode = {
        id: currentId,
        text: getNodeText(key, obj, path),
        description: getNodeDescription(key, obj, path),
        url: getNodeUrl(key, obj, path),
      };
      nodes.push(node);
      nodeMap.set(currentId, node);
    }

    // Create hierarchical link to parent
    if (parentId && createHierarchicalLinks) {
      const linkId = `${parentId}->${currentId}`;
      if (!links.some((link) => `${link.source}->${link.target}` === linkId)) {
        links.push({
          source: parentId,
          target: currentId,
        });
      }
    }

    // Handle objects
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const itemPath = [...path, String(index)];
          traverse(item, itemPath, currentId, depth + 1);

          // Create links between array elements if enabled
          if (createArrayLinks && index > 0) {
            const prevId = createNodeId([...path, String(index - 1)]);
            const currentItemId = createNodeId(itemPath);
            links.push({
              source: prevId,
              target: currentItemId,
            });
          }
        });
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          const childPath = [...path, key];
          traverse(value, childPath, currentId, depth + 1);
        });
      }
    }
  }

  // Start traversal
  traverse(data, ["root"]);

  // Apply custom linking logic if provided
  if (shouldLink) {
    const nodeEntries = Array.from(nodeMap.entries());
    for (let i = 0; i < nodeEntries.length; i++) {
      for (let j = i + 1; j < nodeEntries.length; j++) {
        const [path1, node1] = nodeEntries[i];
        const [path2, node2] = nodeEntries[j];

        if (shouldLink(node1, node2, path1.split("."), path2.split("."))) {
          links.push({
            source: node1.id,
            target: node2.id,
          });
        }
      }
    }
  }

  return { nodes, links };
}

// Preset configurations for common JSON structures
export const presets = {
  // For flat object structures
  flat: {
    maxDepth: 1,
    createHierarchicalLinks: false,
    createArrayLinks: true,
  },

  // For deep nested structures
  deep: {
    maxDepth: 5,
    createHierarchicalLinks: true,
    createArrayLinks: false,
  },

  // For API response structures
  api: {
    maxDepth: 3,
    createHierarchicalLinks: true,
    createArrayLinks: true,
    getNodeText: (key: string, value: any) => {
      if (key === "root") return "API Response";
      if (typeof value === "string" && value.length < 30) return value;
      return key;
    },
  },
};