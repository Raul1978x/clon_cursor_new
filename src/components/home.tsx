import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  FolderIcon,
  SettingsIcon,
  MessageSquareIcon,
  CodeIcon,
  TerminalIcon,
} from "lucide-react";
import InlineCommandPalette from "./nexus/InlineCommandPalette";
import NexusChat from "./nexus/NexusChat";
import ErrorCorrectionTooltip from "./nexus/ErrorCorrectionTooltip";
import DiffPreview from "./nexus/DiffPreview";

const Home = () => {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showErrorTooltip, setShowErrorTooltip] = useState(false);
  const [showDiffPreview, setShowDiffPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("explorer");
  const [code, setCode] = useState(`function fetchData() {
  return fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// This function has a linting error - unused variable
function processData(data) {
  const unusedVar = 'This variable is never used';
  return data.map(item => item.value * 2);
}`);

  // Simulate keyboard shortcut for command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "l") {
      e.preventDefault();
      setShowCommandPalette(true);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-background"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Top Bar */}
      <div className="flex items-center p-2 border-b bg-card">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            File
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Go
          </Button>
          <Button variant="ghost" size="sm">
            Run
          </Button>
          <Button variant="ghost" size="sm">
            Terminal
          </Button>
          <Button variant="ghost" size="sm">
            Help
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-12 border-r bg-card flex flex-col items-center py-4 space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("explorer")}
            className={activeTab === "explorer" ? "bg-accent" : ""}
          >
            <FileIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("chat")}
            className={activeTab === "chat" ? "bg-accent" : ""}
          >
            <MessageSquareIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <CodeIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Explorer/Chat Panel */}
        <div className="w-64 border-r bg-card overflow-hidden">
          <Tabs value={activeTab} className="w-full h-full">
            <TabsContent value="explorer" className="m-0 h-full">
              <div className="p-2 font-medium">EXPLORER</div>
              <ScrollArea className="h-[calc(100%-40px)]">
                <div className="p-2">
                  <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                    <FolderIcon className="h-4 w-4" />
                    <span>src</span>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                      <FolderIcon className="h-4 w-4" />
                      <span>components</span>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                        <FileIcon className="h-4 w-4" />
                        <span>home.tsx</span>
                      </div>
                      <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                        <FileIcon className="h-4 w-4" />
                        <span>InlineCommandPalette.tsx</span>
                      </div>
                      <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                        <FileIcon className="h-4 w-4" />
                        <span>NexusChat.tsx</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                    <FileIcon className="h-4 w-4" />
                    <span>package.json</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer">
                    <FileIcon className="h-4 w-4" />
                    <span>tsconfig.json</span>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="chat" className="m-0 p-0 h-full border-0">
              <NexusChat />
            </TabsContent>
          </Tabs>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 flex flex-col relative bg-background">
          <div className="p-2 border-b text-sm text-muted-foreground">
            home.tsx - nexus-editor/src/components
          </div>
          <div className="flex-1 relative">
            <pre className="p-4 font-mono text-sm h-full overflow-auto">
              <code>{code}</code>
            </pre>

            {/* Inline Command Palette (shown when Cmd/Ctrl+L is pressed) */}
            {showCommandPalette && (
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                <InlineCommandPalette
                  selectedCode={code}
                  onClose={() => setShowCommandPalette(false)}
                  onShowDiff={(originalCode, modifiedCode) => {
                    setShowDiffPreview(true);
                  }}
                />
              </div>
            )}

            {/* Error Tooltip (shown when hovering over an error) */}
            {showErrorTooltip && (
              <div className="absolute top-[240px] left-[300px]">
                <ErrorCorrectionTooltip
                  error="'unusedVar' is declared but its value is never read."
                  code="const unusedVar = 'This variable is never used';"
                  onClose={() => setShowErrorTooltip(false)}
                  onFixWithAI={() => setShowDiffPreview(true)}
                />
              </div>
            )}

            {/* Diff Preview (shown after AI generates a fix) */}
            {showDiffPreview && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <DiffPreview
                  originalCode="const unusedVar = 'This variable is never used';\nreturn data.map(item => item.value * 2);"
                  modifiedCode="return data.map(item => item.value * 2);"
                  onAccept={() => {
                    setShowDiffPreview(false);
                    setShowErrorTooltip(false);
                    // In a real implementation, this would update the actual code
                  }}
                  onReject={() => setShowDiffPreview(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex justify-between items-center p-1 text-xs border-t bg-card text-muted-foreground">
        <div className="flex space-x-4">
          <span>Nexus Editor</span>
          <span>TypeScript React</span>
          <span>UTF-8</span>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setShowErrorTooltip(true)}
          >
            Show Error Tooltip Demo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setShowCommandPalette(true)}
          >
            Show Command Palette Demo (Ctrl+L)
          </Button>
          <span>Ln 15, Col 12</span>
        </div>
      </div>

      {/* Terminal Panel (collapsed by default) */}
      <div className="h-8 border-t bg-card flex items-center px-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <TerminalIcon className="h-4 w-4" />
          <span>Terminal</span>
        </Button>
      </div>
    </div>
  );
};

export default Home;
