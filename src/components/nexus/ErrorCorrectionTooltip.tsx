import React, { useState } from "react";
import { AlertCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ErrorCorrectionTooltipProps {
  errorMessage: string;
  code: string;
  onApplyFix: (newCode: string) => void;
  position?: { x: number; y: number };
}

const ErrorCorrectionTooltip = ({
  errorMessage = "Unexpected token: Consider using template literals instead of concatenation.",
  code = "const greeting = 'Hello ' + name + '!';",
  onApplyFix = () => {},
  position = { x: 0, y: 0 },
}: ErrorCorrectionTooltipProps) => {
  const [showDiff, setShowDiff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFix, setSuggestedFix] = useState("");

  // Mock function to simulate AI fix generation
  const generateFix = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Example suggested fix
    const fixedCode = "const greeting = `Hello ${name}!`;";
    setSuggestedFix(fixedCode);
    setIsLoading(false);
    setShowDiff(true);
  };

  const handleFixClick = () => {
    generateFix();
  };

  const handleApplyFix = () => {
    onApplyFix(suggestedFix);
    setShowDiff(false);
  };

  const handleDismiss = () => {
    setShowDiff(false);
  };

  // Import DiffPreview dynamically when needed
  const DiffPreview = React.lazy(() => import("./DiffPreview"));

  return (
    <div
      className="relative bg-background"
      style={{ position: "absolute", top: position.y, left: position.x }}
    >
      {!showDiff ? (
        <Card className="p-3 shadow-lg border border-red-300 max-w-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-500">{errorMessage}</p>
              <div className="mt-2 flex justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={handleFixClick}
                        disabled={isLoading}
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        {isLoading ? "Generating fix..." : "Fix with AI"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate AI-powered fix for this error</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <React.Suspense
          fallback={
            <div className="p-4 bg-background border rounded-md">
              Loading diff view...
            </div>
          }
        >
          <DiffPreview
            originalCode={code}
            modifiedCode={suggestedFix}
            onAccept={handleApplyFix}
            onReject={handleDismiss}
            title="AI Suggested Fix"
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default ErrorCorrectionTooltip;
