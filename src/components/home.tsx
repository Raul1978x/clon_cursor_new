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
  ChevronRightIcon,
  ChevronDownIcon,
  X,
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
  const [selectedCode, setSelectedCode] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ line: 15, col: 12 });
  const [currentFile, setCurrentFile] = useState("home.tsx");
  const [fileContents, setFileContents] = useState(new Map());
  const [openFiles, setOpenFiles] = useState(["home.tsx"]);
  const [unsavedChanges, setUnsavedChanges] = useState(new Set());
  const [errors, setErrors] = useState([
    {
      line: 15,
      message: "'unusedVar' is declared but its value is never read.",
      code: "const unusedVar = 'This variable is never used';",
      position: { x: 300, y: 240 },
      severity: "warning" as const,
      category: "unused-variable" as const,
    },
    {
      line: 8,
      message:
        "Consider using template literals instead of string concatenation.",
      code: "console.log('Error fetching data:' + error);",
      position: { x: 280, y: 180 },
      severity: "info" as const,
      category: "style" as const,
    },
    {
      line: 3,
      message: "Missing return type annotation.",
      code: "function fetchData() {",
      position: { x: 250, y: 120 },
      severity: "warning" as const,
      category: "typescript" as const,
    },
  ]);
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

  // File system simulation
  const fileSystem = {
    src: {
      components: {
        "home.tsx": `function fetchData() {
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

function processData(data) {
  const unusedVar = 'This variable is never used';
  return data.map(item => item.value * 2);
}`,
        nexus: {
          "InlineCommandPalette.tsx": `import React, { useState } from "react";

const InlineCommandPalette = () => {
  const [prompt, setPrompt] = useState("");
  
  return (
    <div className="command-palette">
      <input 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter command..."
      />
    </div>
  );
};

export default InlineCommandPalette;`,
          "NexusChat.tsx": `import React, { useState } from "react";

const NexusChat = () => {
  const [messages, setMessages] = useState([]);
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
};

export default NexusChat;`,
          "ErrorCorrectionTooltip.tsx": `import React from "react";

const ErrorCorrectionTooltip = ({ error }) => {
  return (
    <div className="error-tooltip">
      <p>{error.message}</p>
      <button>Fix with AI</button>
    </div>
  );
};

export default ErrorCorrectionTooltip;`,
        },
      },
      utils: {
        "helpers.ts": `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};`,
      },
    },
    "package.json": `{
  "name": "nexus-editor",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`,
    "README.md": `# Nexus Editor

An AI-powered code editor built with React and TypeScript.

## Features

- Inline AI Command Palette
- Smart Error Correction
- Real-time Chat Assistant
- Code Generation and Refactoring

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`,
  };

  // Initialize file contents
  React.useEffect(() => {
    const contents = new Map();
    contents.set("home.tsx", code);
    setFileContents(contents);
  }, []);

  // File operations
  const openFile = (filePath: string) => {
    const content = getFileContent(filePath);
    if (content !== null) {
      setCurrentFile(filePath);
      setCode(content);
      if (!openFiles.includes(filePath)) {
        setOpenFiles([...openFiles, filePath]);
      }
    }
  };

  const closeFile = (filePath: string) => {
    const newOpenFiles = openFiles.filter((f) => f !== filePath);
    setOpenFiles(newOpenFiles);
    if (filePath === currentFile && newOpenFiles.length > 0) {
      setCurrentFile(newOpenFiles[0]);
      setCode(getFileContent(newOpenFiles[0]) || "");
    }
  };

  const saveFile = () => {
    const newContents = new Map(fileContents);
    newContents.set(currentFile, code);
    setFileContents(newContents);
    const newUnsaved = new Set(unsavedChanges);
    newUnsaved.delete(currentFile);
    setUnsavedChanges(newUnsaved);
    console.log(`File ${currentFile} saved successfully!`);
  };

  const getFileContent = (filePath: string): string | null => {
    const parts = filePath.split("/");
    let current: any = fileSystem;

    for (const part of parts) {
      if (current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }

    return typeof current === "string" ? current : null;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const newUnsaved = new Set(unsavedChanges);
    newUnsaved.add(currentFile);
    setUnsavedChanges(newUnsaved);
  };

  // Enhanced keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "l") {
      e.preventDefault();
      setShowCommandPalette(true);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setActiveTab(activeTab === "chat" ? "explorer" : "chat");
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      saveFile();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "w") {
      e.preventDefault();
      closeFile(currentFile);
    }
    if (e.key === "Escape") {
      setShowCommandPalette(false);
      setShowErrorTooltip(false);
      setShowDiffPreview(false);
    }
  };

  // Simulate text selection
  const handleCodeClick = (e: React.MouseEvent) => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setSelectedCode(selection);
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
                  <FileTreeNode
                    name="src"
                    type="folder"
                    level={0}
                    onFileClick={openFile}
                    children={[
                      {
                        name: "components",
                        type: "folder",
                        children: [
                          {
                            name: "home.tsx",
                            type: "file",
                            path: "src/components/home.tsx",
                          },
                          {
                            name: "nexus",
                            type: "folder",
                            children: [
                              {
                                name: "InlineCommandPalette.tsx",
                                type: "file",
                                path: "src/components/nexus/InlineCommandPalette.tsx",
                              },
                              {
                                name: "NexusChat.tsx",
                                type: "file",
                                path: "src/components/nexus/NexusChat.tsx",
                              },
                              {
                                name: "ErrorCorrectionTooltip.tsx",
                                type: "file",
                                path: "src/components/nexus/ErrorCorrectionTooltip.tsx",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: "utils",
                        type: "folder",
                        children: [
                          {
                            name: "helpers.ts",
                            type: "file",
                            path: "src/utils/helpers.ts",
                          },
                        ],
                      },
                    ]}
                  />
                  <FileTreeNode
                    name="package.json"
                    type="file"
                    level={0}
                    path="package.json"
                    onFileClick={openFile}
                  />
                  <FileTreeNode
                    name="README.md"
                    type="file"
                    level={0}
                    path="README.md"
                    onFileClick={openFile}
                  />
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
          {/* File Tabs */}
          <div className="flex border-b bg-card">
            {openFiles.map((file) => (
              <div
                key={file}
                className={`flex items-center px-3 py-2 border-r cursor-pointer text-sm ${
                  file === currentFile ? "bg-background" : "hover:bg-accent"
                }`}
                onClick={() => {
                  setCurrentFile(file);
                  setCode(getFileContent(file) || "");
                }}
              >
                <span
                  className={unsavedChanges.has(file) ? "text-orange-500" : ""}
                >
                  {file}
                  {unsavedChanges.has(file) && " •"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="p-2 border-b text-sm text-muted-foreground flex justify-between">
            <span>{currentFile} - nexus-editor</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={saveFile}
                disabled={!unsavedChanges.has(currentFile)}
              >
                Save (Ctrl+S)
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              className="p-4 font-mono text-sm h-full w-full resize-none border-none outline-none bg-transparent"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onClick={handleCodeClick}
              style={{ lineHeight: "1.5" }}
            />
            <div className="absolute inset-0 pointer-events-none">
              <pre className="p-4 font-mono text-sm h-full overflow-auto">
                <code className="whitespace-pre-wrap">
                  {code.split("\n").map((line, index) => (
                    <div key={index} className="flex hover:bg-accent/20">
                      <span className="w-8 text-muted-foreground select-none text-right pr-2">
                        {index + 1}
                      </span>
                      <span
                        className={`flex-1 relative ${
                          errors.some((err) => err.line === index + 1)
                            ? errors.find((err) => err.line === index + 1)
                                ?.severity === "error"
                              ? "bg-red-100 dark:bg-red-900/20 border-l-2 border-red-500"
                              : errors.find((err) => err.line === index + 1)
                                    ?.severity === "warning"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 border-l-2 border-yellow-500"
                                : "bg-blue-100 dark:bg-blue-900/20 border-l-2 border-blue-500"
                            : ""
                        }`}
                        onMouseEnter={() => {
                          if (errors.some((err) => err.line === index + 1)) {
                            setShowErrorTooltip(true);
                          }
                        }}
                        onMouseLeave={() => {
                          setTimeout(() => setShowErrorTooltip(false), 2000);
                        }}
                      >
                        <span className="invisible">{line}</span>
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Inline Command Palette (shown when Cmd/Ctrl+L is pressed) */}
            {showCommandPalette && (
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-50">
                <InlineCommandPalette
                  selectedCode={selectedCode || code}
                  onClose={() => setShowCommandPalette(false)}
                  position={{ x: 0, y: 0 }}
                />
              </div>
            )}

            {/* Error Tooltip (shown when hovering over an error) */}
            {showErrorTooltip && errors.length > 0 && (
              <div
                className="absolute z-40"
                style={{
                  top: errors[0].position.y,
                  left: errors[0].position.x,
                }}
              >
                <ErrorCorrectionTooltip
                  errorMessage={errors[0].message}
                  code={errors[0].code}
                  onApplyFix={(newCode) => {
                    // Apply the fix to the code
                    const updatedCode = code.replace(errors[0].code, newCode);
                    setCode(updatedCode);
                    setShowErrorTooltip(false);

                    // Remove the fixed error and update positions
                    const remainingErrors = errors
                      .filter((_, i) => i !== 0)
                      .map((error) => ({
                        ...error,
                        line:
                          error.line > errors[0].line
                            ? error.line - 1
                            : error.line,
                      }));
                    setErrors(remainingErrors);

                    // Show success feedback
                    console.log("Fix applied successfully!");
                  }}
                  position={errors[0].position}
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
            onClick={() => {
              setShowErrorTooltip(true);
              // Auto-hide after 5 seconds
              setTimeout(() => setShowErrorTooltip(false), 5000);
            }}
          >
            Demo Error Tooltip
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => setShowCommandPalette(true)}
          >
            Command Palette (Ctrl+L)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() =>
              setActiveTab(activeTab === "chat" ? "explorer" : "chat")
            }
          >
            Toggle Chat (Ctrl+K)
          </Button>
          <span className="text-amber-600">
            {errors.filter((e) => e.severity === "error").length} errors,{" "}
            {errors.filter((e) => e.severity === "warning").length} warnings
          </span>
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
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

// File Tree Component
interface FileTreeNodeProps {
  name: string;
  type: "file" | "folder";
  level: number;
  path?: string;
  children?: FileTreeNodeProps[];
  onFileClick?: (path: string) => void;
}

const FileTreeNode = ({
  name,
  type,
  level,
  path,
  children,
  onFileClick,
}: FileTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleClick = () => {
    if (type === "folder") {
      setIsExpanded(!isExpanded);
    } else if (path && onFileClick) {
      onFileClick(path);
    }
  };

  return (
    <div>
      <div
        className="flex items-center space-x-2 p-1 hover:bg-accent rounded cursor-pointer"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {type === "folder" && (
          <span className="w-4 h-4">
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </span>
        )}
        {type === "folder" ? (
          <FolderIcon className="h-4 w-4" />
        ) : (
          <FileIcon className="h-4 w-4" />
        )}
        <span>{name}</span>
      </div>
      {type === "folder" && isExpanded && children && (
        <div>
          {children.map((child, index) => (
            <FileTreeNode
              key={index}
              {...child}
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
