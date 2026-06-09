"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import jsonToTs from "json-to-ts";
import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";

type TTypeGeneratorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsonContent: string;
  theme: "light" | "dark";
};

const editorFont = EditorView.theme({
  "&": { fontSize: "12px", height: "100%" },
  ".cm-content": { fontFamily: "var(--font-geist-mono)" },
});

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
      return interfaces.join("\n\n").replace(/interface\s+([A-Z]\w*)\s*{/g, "type $1 = {");
    } catch {
      return "// Invalid JSON";
    }
  }, [jsonContent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={types}
            height="100%"
            style={{ height: "100%" }}
            theme={theme}
            readOnly
            extensions={[
              javascript({ typescript: true }),
              EditorView.lineWrapping,
              editorFont,
            ]}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
