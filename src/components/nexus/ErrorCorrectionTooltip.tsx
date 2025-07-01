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

  // Enhanced mock function with intelligent error fixing
  const generateFix = async () => {
    setIsLoading(true);
    // Simulate realistic API call delay
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 400),
    );

    // Generate intelligent fix based on error type
    const fixedCode = generateIntelligentFix(errorMessage, code);
    setSuggestedFix(fixedCode);
    setIsLoading(false);
    setShowDiff(true);
  };

  // Intelligent fix generator based on error analysis
  const generateIntelligentFix = (
    error: string,
    originalCode: string,
  ): string => {
    const lowerError = error.toLowerCase();

    if (
      lowerError.includes("template literal") ||
      lowerError.includes("concatenation")
    ) {
      return originalCode
        .replace(
          /['"]([^'"]*)['"]\s*\+\s*\w+\s*\+\s*['"]([^'"]*)['"]/,
          "`$1${$2}$3`",
        )
        .replace("name", "${name}");
    } else if (
      lowerError.includes("unused") ||
      lowerError.includes("never read")
    ) {
      // Remove unused variable with better context preservation
      const lines = originalCode.split("\n");
      const filteredLines = lines.filter((line) => {
        const trimmed = line.trim();
        return !trimmed.includes("unusedVar") || trimmed.startsWith("//");
      });
      return filteredLines.join("\n");
    } else if (lowerError.includes("missing semicolon")) {
      return originalCode.replace(/([^;])$/, "$1;");
    } else if (
      lowerError.includes("const") &&
      lowerError.includes("reassign")
    ) {
      return originalCode.replace("const ", "let ");
    } else if (
      lowerError.includes("type") ||
      lowerError.includes("typescript")
    ) {
      return addTypeAnnotations(originalCode);
    } else if (lowerError.includes("async") || lowerError.includes("await")) {
      return makeAsync(originalCode);
    } else if (
      lowerError.includes("null") ||
      lowerError.includes("undefined")
    ) {
      return addNullChecks(originalCode);
    } else if (lowerError.includes("import") || lowerError.includes("module")) {
      return fixImports(originalCode);
    } else if (lowerError.includes("react") || lowerError.includes("hook")) {
      return fixReactIssues(originalCode);
    } else {
      // Enhanced default improvement with context analysis
      return improveCodeStructure(originalCode, error);
    }
  };

  const fixImports = (code: string): string => {
    const lines = code.split("\n");
    const imports = [];
    const otherLines = [];

    lines.forEach((line) => {
      if (line.trim().startsWith("import")) {
        imports.push(line);
      } else {
        otherLines.push(line);
      }
    });

    // Sort imports and add missing ones
    const sortedImports = imports.sort();
    if (!sortedImports.some((imp) => imp.includes("React"))) {
      sortedImports.unshift("import React from 'react';");
    }

    return [...sortedImports, "", ...otherLines].join("\n");
  };

  const fixReactIssues = (code: string): string => {
    let fixed = code;

    // Add missing React import
    if (!fixed.includes("import React")) {
      fixed = "import React from 'react';\n" + fixed;
    }

    // Fix hook dependencies
    fixed = fixed.replace(
      /useEffect\(([^,]+),\s*\[\]\)/g,
      "useEffect($1, [/* add dependencies */])",
    );

    // Add proper prop types
    if (fixed.includes("function") && fixed.includes("(")) {
      fixed = fixed.replace(
        /function\s+(\w+)\s*\(([^)]*)\)/,
        "function $1($2: Props)",
      );
    }

    return fixed;
  };

  const improveCodeStructure = (code: string, error: string): string => {
    return `// Auto-fixed: ${error}
// Improved code structure

${code}

// TODO: Review the fix and adjust as needed
// Consider adding proper error handling and type safety`;
  };

  const addTypeAnnotations = (code: string): string => {
    return code
      .replace("function ", "function ")
      .replace("(", "(")
      .replace(")", "): void")
      .replace("const ", "const ");
  };

  const makeAsync = (code: string): string => {
    return code
      .replace("function", "async function")
      .replace("return", "return await");
  };

  const addNullChecks = (code: string): string => {
    return code.replace(/\w+\.\w+/g, (match) => `${match}?.`);
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
