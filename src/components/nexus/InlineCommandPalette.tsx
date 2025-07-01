import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InlineCommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedCode?: string;
  position?: { x: number; y: number };
}

interface DiffPreviewProps {
  originalCode: string;
  newCode: string;
}

// Temporary placeholder for DiffPreview component
const DiffPreview = ({ originalCode, newCode }: DiffPreviewProps) => {
  return (
    <div className="border rounded-md p-4 bg-muted/30">
      <div className="mb-2 pb-2 border-b">
        <h4 className="text-sm font-medium">Original Code:</h4>
        <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto">
          {originalCode}
        </pre>
      </div>
      <div>
        <h4 className="text-sm font-medium">New Code:</h4>
        <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto">
          {newCode}
        </pre>
      </div>
    </div>
  );
};

const InlineCommandPalette = ({
  isOpen = true,
  onClose = () => {},
  selectedCode = 'function example() {\n  console.log("Hello world");\n}',
  position = { x: 100, y: 100 },
}: InlineCommandPaletteProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // Enhanced mock function with intelligent code generation
  const processPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    // Simulate API delay with realistic timing
    await new Promise((resolve) =>
      setTimeout(resolve, 1200 + Math.random() * 800),
    );

    // Intelligent mock response based on prompt and selected code
    const mockGeneratedCode = generateIntelligentResponse(prompt, selectedCode);

    setGeneratedCode(mockGeneratedCode);
    setIsLoading(false);
    setShowDiff(true);
  };

  // Intelligent response generator based on prompt analysis
  const generateIntelligentResponse = (
    userPrompt: string,
    code: string,
  ): string => {
    const lowerPrompt = userPrompt.toLowerCase();

    if (lowerPrompt.includes("component") || lowerPrompt.includes("react")) {
      return createReactComponent(code, userPrompt);
    } else if (
      lowerPrompt.includes("hook") ||
      lowerPrompt.includes("usestate")
    ) {
      return addReactHooks(code);
    } else if (lowerPrompt.includes("api") || lowerPrompt.includes("fetch")) {
      return createApiCall(code, userPrompt);
    } else if (
      lowerPrompt.includes("comment") ||
      lowerPrompt.includes("document")
    ) {
      return addCommentsToCode(code);
    } else if (
      lowerPrompt.includes("async") ||
      lowerPrompt.includes("await") ||
      lowerPrompt.includes("promise")
    ) {
      return convertToAsync(code);
    } else if (
      lowerPrompt.includes("typescript") ||
      lowerPrompt.includes("type")
    ) {
      return addTypeScript(code);
    } else if (
      lowerPrompt.includes("error") ||
      lowerPrompt.includes("try") ||
      lowerPrompt.includes("catch")
    ) {
      return addErrorHandling(code);
    } else if (
      lowerPrompt.includes("optimize") ||
      lowerPrompt.includes("performance")
    ) {
      return optimizeCode(code);
    } else if (
      lowerPrompt.includes("test") ||
      lowerPrompt.includes("unit test")
    ) {
      return generateTests(code);
    } else if (
      lowerPrompt.includes("refactor") ||
      lowerPrompt.includes("clean")
    ) {
      return refactorCode(code);
    } else {
      return enhanceCode(code, userPrompt);
    }
  };

  const createReactComponent = (code: string, prompt: string): string => {
    const componentName = extractComponentName(prompt) || "NewComponent";
    return `import React, { useState } from 'react';

interface ${componentName}Props {
  title?: string;
  onAction?: () => void;
}

const ${componentName} = ({ title = "Default Title", onAction }: ${componentName}Props) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onAction?.();
  };

  return (
    <div className={\`component-container \${isActive ? 'active' : ''}\`}>
      <h2>{title}</h2>
      <button onClick={handleClick}>
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
      {/* Original code integration */}
      <div className="original-content">
        {/* ${code.split("\n")[0]} */}
      </div>
    </div>
  );
};

export default ${componentName};`;
  };

  const addReactHooks = (code: string): string => {
    return `import React, { useState, useEffect, useCallback } from 'react';

// Enhanced with React hooks
const EnhancedComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      ${code.includes("fetch") ? code : '// Original logic here\n      const result = await fetch("/api/data");\n      const data = await result.json();'}
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {/* Render your data here */}
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default EnhancedComponent;`;
  };

  const createApiCall = (code: string, prompt: string): string => {
    const endpoint = extractEndpoint(prompt) || "/api/data";
    return `// Enhanced API integration
const apiService = {
  async ${extractMethodName(prompt) || "fetchData"}() {
    try {
      const response = await fetch('${endpoint}', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
        }
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }
};

// Usage in component
${code}

// Integration example:
// const data = await apiService.fetchData();`;
  };

  const extractComponentName = (prompt: string): string | null => {
    const match = prompt.match(
      /component\s+(?:called\s+|named\s+)?([A-Za-z][A-Za-z0-9]*)/i,
    );
    return match ? match[1] : null;
  };

  const extractEndpoint = (prompt: string): string | null => {
    const match = prompt.match(/\/[a-zA-Z0-9\/\-_]+/);
    return match ? match[0] : null;
  };

  const extractMethodName = (prompt: string): string | null => {
    const match = prompt.match(
      /(get|post|put|delete|fetch)\s*([A-Za-z][A-Za-z0-9]*)?/i,
    );
    return match ? (match[2] ? `${match[1]}${match[2]}` : match[1]) : null;
  };

  const addCommentsToCode = (code: string): string => {
    if (code.includes("function example")) {
      return `/**
 * Example function that demonstrates basic functionality
 * @returns {boolean} Always returns true
 */
function example() {
  // Log a greeting message to the console
  console.log("Hello world!");
  
  // Return success status
  return true;
}`;
    }
    return `// Enhanced with documentation\n${code
      .split("\n")
      .map((line) =>
        line.trim() ? `${line} // TODO: Add specific comment` : line,
      )
      .join("\n")}`;
  };

  const convertToAsync = (code: string): string => {
    if (code.includes("function example")) {
      return `async function example() {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log a greeting message to the console
  console.log("Hello world!");
  
  // Return a promise that resolves to true
  return Promise.resolve(true);
}`;
    }
    return `async ${code.replace("function", "function").replace("{", "{\n  await new Promise(resolve => setTimeout(resolve, 100));")}`;
  };

  const addTypeScript = (code: string): string => {
    if (code.includes("function example")) {
      return `function example(): Promise<boolean> {
  // Log a greeting message to the console
  console.log("Hello world!");
  
  // Return a typed value
  return Promise.resolve(true);
}`;
    }
    return code.replace("function", "function").replace("()", "(): void");
  };

  const addErrorHandling = (code: string): string => {
    return `try {
${code
  .split("\n")
  .map((line) => "  " + line)
  .join("\n")}
} catch (error) {
  console.error('An error occurred:', error);
  throw error;
}`;
  };

  const optimizeCode = (code: string): string => {
    if (code.includes("console.log")) {
      return code.replace(
        'console.log("Hello world!");',
        `// Optimized logging with performance consideration
if (process.env.NODE_ENV === 'development') {
  console.log("Hello world!");
}`,
      );
    }
    return `// Optimized version\n${code}\n// TODO: Consider memoization for expensive operations`;
  };

  const generateTests = (code: string): string => {
    return `// Unit tests for the function
import { example } from './example';

describe('example function', () => {
  test('should return true', () => {
    const result = example();
    expect(result).toBe(true);
  });
  
  test('should log hello world', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    example();
    expect(consoleSpy).toHaveBeenCalledWith('Hello world!');
  });
});`;
  };

  const refactorCode = (code: string): string => {
    if (code.includes("function example")) {
      return `// Refactored with better structure
const GREETING_MESSAGE = "Hello world!";

function example(): boolean {
  logGreeting();
  return getSuccessStatus();
}

function logGreeting(): void {
  console.log(GREETING_MESSAGE);
}

function getSuccessStatus(): boolean {
  return true;
}`;
    }
    return `// Refactored code\n${code}\n// TODO: Extract constants and helper functions`;
  };

  const enhanceCode = (code: string, prompt: string): string => {
    return `// Enhanced based on: "${prompt}"
${code}

// Additional functionality added
// TODO: Implement specific enhancements based on requirements`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processPrompt();
  };

  const handleAccept = () => {
    // In a real implementation, this would apply the changes to the editor
    console.log("Changes accepted");
    onClose();
  };

  const handleReject = () => {
    setShowDiff(false);
    setGeneratedCode("");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && e.metaKey) {
        processPrompt();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prompt]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed z-50 bg-background"
          style={{
            top: position.y,
            left: position.x,
            width: "600px",
            maxWidth: "90vw",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border shadow-lg">
            <CardContent className="p-4">
              {!showDiff ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">AI Command</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Close</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to do with the selected code..."
                      className="flex-1"
                      disabled={isLoading}
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Press{" "}
                    <kbd className="px-1 py-0.5 bg-muted rounded border">
                      Cmd/Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-1 py-0.5 bg-muted rounded border">
                      Enter
                    </kbd>{" "}
                    to generate or{" "}
                    <kbd className="px-1 py-0.5 bg-muted rounded border">
                      Esc
                    </kbd>{" "}
                    to close
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Review Changes</h3>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleReject}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Reject changes</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="default"
                              size="icon"
                              onClick={handleAccept}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Accept changes</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <DiffPreview
                    originalCode={selectedCode}
                    newCode={generatedCode}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleReject}>
                      Reject
                    </Button>
                    <Button onClick={handleAccept}>Accept Changes</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InlineCommandPalette;
