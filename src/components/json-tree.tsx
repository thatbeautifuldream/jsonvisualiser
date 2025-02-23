import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface JsonViewProps {
  parsedJson: any;
  error: string | null;
}

export function JsonTree({ parsedJson, error }: JsonViewProps) {
  const { theme, resolvedTheme } = useTheme();

  const jsonViewTheme =
    (resolvedTheme || theme) === "dark" ? "bright" : "bright:inverted";

  return (
    <div className="h-full overflow-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {parsedJson && (
        <ReactJson
          src={parsedJson}
          theme={jsonViewTheme}
          displayDataTypes={false}
          enableClipboard={false}
          collapsed={1}
          style={{ padding: "1rem" }}
        />
      )}
    </div>
  );
}
