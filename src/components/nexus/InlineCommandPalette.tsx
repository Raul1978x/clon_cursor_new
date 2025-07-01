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

  // Mock function to simulate API call
  const processPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response - in a real implementation this would come from the API
    const mockGeneratedCode = `function example() {\n  // Log a greeting message to the console\n  console.log("Hello world!");\n  \n  // Return a value\n  return true;\n}`;

    setGeneratedCode(mockGeneratedCode);
    setIsLoading(false);
    setShowDiff(true);
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
