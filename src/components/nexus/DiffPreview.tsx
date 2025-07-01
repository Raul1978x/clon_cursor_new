import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DiffLine {
  type: "addition" | "deletion" | "context";
  content: string;
  lineNumber?: number;
}

interface DiffPreviewProps {
  originalCode?: string;
  modifiedCode?: string;
  diffLines?: DiffLine[];
  onAccept?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
  title?: string;
}

const DiffPreview = ({
  originalCode = "",
  modifiedCode = "",
  diffLines = generateMockDiffLines(),
  onAccept = () => console.log("Changes accepted"),
  onReject = () => console.log("Changes rejected"),
  isLoading = false,
  title = "Code Changes Preview",
}: DiffPreviewProps) => {
  // If diffLines are not provided, we could compute them here
  // For now we're using the mock data if not provided

  return (
    <Card className="w-full max-w-3xl bg-background border shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReject}
            className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAccept}
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
            Accept
          </Button>
        </div>
      </div>
      <CardContent className="p-0 overflow-hidden">
        <div className="overflow-auto max-h-[400px] font-mono text-sm">
          <pre className="p-0 m-0">
            <code className="block p-4">
              {diffLines.map((line, index) => (
                <div
                  key={index}
                  className={`flex ${getLineBackgroundColor(line.type)}`}
                >
                  <span className="w-6 text-muted-foreground select-none">
                    {getLinePrefix(line.type)}
                  </span>
                  <span className="px-2">{line.content}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getLineBackgroundColor = (type: DiffLine["type"]) => {
  switch (type) {
    case "addition":
      return "bg-green-500/10";
    case "deletion":
      return "bg-red-500/10";
    default:
      return "";
  }
};

const getLinePrefix = (type: DiffLine["type"]) => {
  switch (type) {
    case "addition":
      return "+";
    case "deletion":
      return "-";
    default:
      return " ";
  }
};

// Mock data generator for default prop values
function generateMockDiffLines(): DiffLine[] {
  return [
    { type: "context", content: "function calculateTotal(items) {" },
    { type: "deletion", content: "  let total = 0;" },
    { type: "deletion", content: "  for (let i = 0; i < items.length; i++) {" },
    { type: "deletion", content: "    total += items[i].price;" },
    { type: "deletion", content: "  }" },
    {
      type: "addition",
      content: "  const total = items.reduce((sum, item) => {",
    },
    { type: "addition", content: "    return sum + item.price;" },
    { type: "addition", content: "  }, 0);" },
    { type: "context", content: "  return total;" },
    { type: "context", content: "}" },
  ];
}

export default DiffPreview;
