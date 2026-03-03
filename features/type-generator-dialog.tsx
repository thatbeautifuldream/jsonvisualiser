"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import jsonToTs from "json-to-ts";
import { useMemo } from "react";
import Editor from "@monaco-editor/react";

type TTypeGeneratorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsonContent: string;
  theme: "light" | "hc-black";
};

export function TypeGeneratorDialog({
  open,
  onOpenChange,
  jsonContent,
  theme,
}: TTypeGeneratorDialogProps) {
  const types = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonContent);
      const interfaces = jsonToTs(parsed);
      return interfaces.join("\n\n");
    } catch {
      return "// Invalid JSON";
    }
  }, [jsonContent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={types}
            theme={theme}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: "var(--font-geist-mono)",
              lineNumbers: "off",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
            }}
            loading={
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading editor...
              </div>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
