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
      message: "Consider using template literals instead of string concatenation.",
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
    {
      line: 22,
      message: "Async function should handle promise rejection.",
      code: "async function loadData() {",
      position: { x: 320, y: 300 },
      severity: "error" as const,
      category: "async-error" as const,
    },
    {
      line: 5,
      message: "Consider using optional chaining for safer property access.",
      code: "return data.items.length;",
      position: { x: 260, y: 160 },
      severity: "info" as const,
      category: "safety" as const,
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

  // Enhanced file system simulation with more realistic project structure
  const fileSystem = {
    src: {
      components: {
        "home.tsx": `import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, MessageSquareIcon } from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("explorer");
  const [selectedCode, setSelectedCode] = useState("");
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main editor interface */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card">
          <div className="p-2 font-medium">EXPLORER</div>
        </div>
        
        {/* Code editor area */}
        <div className="flex-1 bg-background">
          <textarea 
            className="w-full h-full p-4 font-mono text-sm"
            placeholder="Start coding..."
          />
        </div>
      </div>
    </div>
  );
};

export default Home;`,
        nexus: {
          "InlineCommandPalette.tsx": `import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface InlineCommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedCode?: string;
  position?: { x: number; y: number };
}

const InlineCommandPalette = ({
  isOpen = true,
  onClose = () => {},
  selectedCode = '',
  position = { x: 100, y: 100 },
}: InlineCommandPaletteProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const processPrompt = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock response
    const mockCode = generateMockCode(prompt, selectedCode);
    setGeneratedCode(mockCode);
    setIsLoading(false);
    setShowDiff(true);
  };

  const generateMockCode = (userPrompt: string, code: string): string => {
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes("component")) {
      return \`import React from 'react';

const NewComponent = () => {
  return (
    <div className="p-4">
      <h2>Generated Component</h2>
      <p>Based on: ${userPrompt}</p>
    </div>
  );
};

export default NewComponent;\`;
    }
    
    return \`// Enhanced code based on: "\${userPrompt}"
\${code}

// Additional functionality added\`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed z-50 bg-background border rounded-lg shadow-lg p-4"
          style={{ top: position.y, left: position.x, width: "500px" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">AI Command</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to do..."
              className="flex-1"
              autoFocus
            />
            <Button onClick={processPrompt} disabled={isLoading || !prompt.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InlineCommandPalette;`,
          "NexusChat.tsx": `import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const NexusChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Nexus AI. How can I help you with your project today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("help") || lowerQuery.includes("how")) {
      return "I can help you with React components, TypeScript, debugging, and code optimization. What specific area would you like assistance with?";
    }
    
    if (lowerQuery.includes("component")) {
      return "I can help you create React components! Would you like me to generate a functional component, a component with hooks, or help with component architecture?";
    }
    
    if (lowerQuery.includes("error") || lowerQuery.includes("bug")) {
      return "I can help debug issues! Please share the error message or describe the problem you're encountering, and I'll provide suggestions to fix it.";
    }
    
    return "I understand you're asking about: " + query + ". Could you provide more specific details so I can give you the best assistance?";
  };

  return (
    <Card className="flex h-full flex-col bg-background">
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Nexus Chat</h2>
          <p className="text-sm text-muted-foreground">Project-aware AI assistance</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={\`flex \${message.sender === "user" ? "justify-end" : "justify-start"}\`}
              >
                <div className={\`flex max-w-[80%] \${message.sender === "user" ? "flex-row-reverse" : "flex-row"}\`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender === "ai" ? <Bot size={16} /> : <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={\`mx-2 rounded-lg p-3 \${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}\`}>
                    {message.content}
                    <div className="mt-1 text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask about your project..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NexusChat;`,
          "ErrorCorrectionTooltip.tsx": `import React, { useState } from "react";
import { AlertCircle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorCorrectionTooltipProps {
  errorMessage?: string;
  code?: string;
  onApplyFix?: (newCode: string) => void;
  position?: { x: number; y: number };
}

const ErrorCorrectionTooltip = ({
  errorMessage = "Unexpected token: Consider using template literals instead of concatenation.",
  code = "const greeting = 'Hello ' + name + '!';",
  onApplyFix = () => {},
  position = { x: 0, y: 0 },
}: ErrorCorrectionTooltipProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [suggestedFix, setSuggestedFix] = useState("");

  const generateFix = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate intelligent fix
    const fix = generateIntelligentFix(errorMessage, code);
    setSuggestedFix(fix);
    setIsLoading(false);
    setShowFix(true);
  };

  const generateIntelligentFix = (error: string, originalCode: string): string => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes("template literal") || lowerError.includes("concatenation")) {
      return originalCode.replace(/['"]([^'"]*)['"]\\s*\\+\\s*\\w+\\s*\\+\\s*['"]([^'"]*)['"]/,
        "`$1\${name}$2`");
    }
    
    if (lowerError.includes("unused") || lowerError.includes("never read")) {
      return originalCode.split('\\n').filter(line => 
        !line.includes('unusedVar')
      ).join('\\n');
    }
    
    return \`// Fixed: \${error}
\${originalCode}
// TODO: Review and adjust as needed\`;
  };

  const handleApplyFix = () => {
    onApplyFix(suggestedFix);
    setShowFix(false);
  };

  return (
    <div className="relative" style={{ position: "absolute", top: position.y, left: position.x }}>
      <Card className="p-3 shadow-lg border border-red-300 max-w-md bg-background">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-500">{errorMessage}</p>
            {!showFix ? (
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-red-200 hover:bg-red-50"
                  onClick={generateFix}
                  disabled={isLoading}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {isLoading ? "Generating..." : "Fix with AI"}
                </Button>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-muted rounded text-xs font-mono">
                  {suggestedFix}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFix(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleApplyFix}>
                    Apply Fix
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorCorrectionTooltip;`,
          "DiffPreview.tsx": `import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiffPreviewProps {
  originalCode: string;
  modifiedCode: string;
  onAccept: () => void;
  onReject: () => void;
  title?: string;
}

const DiffPreview = ({
  originalCode = "const example = 'old code';",
  modifiedCode = "const example = 'new improved code';",
  onAccept = () => {},
  onReject = () => {},
  title = "Code Changes"
}: DiffPreviewProps) => {
  return (
    <Card className="w-full max-w-4xl bg-background">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onReject}>
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button size="sm" onClick={onAccept}>
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-red-600">- Original</h4>
            <pre className="p-3 bg-red-50 dark:bg-red-900/20 rounded border text-xs overflow-auto">
              <code>{originalCode}</code>
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-green-600">+ Modified</h4>
            <pre className="p-3 bg-green-50 dark:bg-green-900/20 rounded border text-xs overflow-auto">
              <code>{modifiedCode}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiffPreview;`,
        },
      },
      utils: {
        "helpers.ts": `export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};`,
      },
      hooks: {
        "useLocalStorage.ts": `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}`,
        "useDebounce.ts": `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
      },
      services: {
        "aiService.ts": `interface AIRequest {
  prompt: string;
  code?: string;
  context?: string;
}

interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

class AIService {
  private baseUrl = '/api/ai';

  async generateCode(request: AIRequest): Promise<AIResponse> {
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        data: this.mockCodeGeneration(request.prompt, request.code || '')
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate code'
      };
    }
  }

  async fixError(errorMessage: string, code: string): Promise<AIResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: this.mockErrorFix(errorMessage, code)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fix error'
      };
    }
  }

  async chatResponse(message: string, context?: string): Promise<AIResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        success: true,
        data: this.mockChatResponse(message, context)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get chat response'
      };
    }
  }

  private mockCodeGeneration(prompt: string, code: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('component')) {
      return \`import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="p-4">
      <h2>Generated Component</h2>
      <p>Based on prompt: \${prompt}</p>
    </div>
  );
};

export default GeneratedComponent;\`;
    }
    
    return \`// Enhanced code based on: "\${prompt}"
\${code}

// Additional functionality added\`;
  }

  private mockErrorFix(error: string, code: string): string {
    if (error.toLowerCase().includes('unused')) {
      return code.split('\n').filter(line => 
        !line.includes('unusedVar')
      ).join('\n');
    }
    
    return \`// Fixed: \${error}
\${code}\`;
  }

  private mockChatResponse(message: string, context?: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('help')) {
      return 'I can help you with React components, TypeScript, debugging, and code optimization. What specific area would you like assistance with?';
    }
    
    return \`I understand you're asking about: \${message}. Could you provide more specific details?\`;
  }
}

export const aiService = new AIService();`,
      },
    },
    "package.json": `{
  "name": "nexus-editor",
  "version": "1.0.0",
  "description": "AI-powered code editor built with React and TypeScript",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "lucide-react": "^0.394.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}`,
    "README.md": `# Nexus Editor - AI-Powered Code Editor

A revolutionary VS Code-inspired editor that integrates AI directly into the developer workflow, allowing code generation, editing, and understanding through natural language without context switching.

## 🚀 Features

### Core Features
- **Inline AI Command Palette** - Floating interface triggered by Cmd/Ctrl+L
- **Nexus Chat Panel** - Persistent sidebar chat with project-aware AI assistance
- **Smart Error Correction** - "Fix with AI" option on hover for linter errors
- **Real-time Code Editor** - Full-featured code editor with syntax highlighting
- **File System Navigation** - Interactive file tree with open/close functionality

### AI Capabilities
- Natural language code generation
- Intelligent error correction and suggestions
- Project-aware assistance and context understanding
- Code refactoring and optimization suggestions
- Real-time chat assistance with code highlighting

### Technical Features
- React-based UI components with TypeScript
- Modular service architecture for AI backend communication
- Responsive design with Tailwind CSS
- Framer Motion animations for smooth interactions
- Local storage for user preferences and session data

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd nexus-editor

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Development

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── home.tsx              # Main editor interface
│   ├── nexus/                # AI-powered components
│   │   ├── InlineCommandPalette.tsx
│   │   ├── NexusChat.tsx
│   │   ├── ErrorCorrectionTooltip.tsx
│   │   └── DiffPreview.tsx
│   └── ui/                   # Reusable UI components
├── hooks/                    # Custom React hooks
├── services/                 # AI service layer
├── utils/                    # Utility functions
└── types/                    # TypeScript type definitions
\`\`\`

## 🎯 Usage

### Keyboard Shortcuts
- **Cmd/Ctrl + L**: Open Inline Command Palette
- **Cmd/Ctrl + K**: Toggle Nexus Chat Panel
- **Cmd/Ctrl + S**: Save current file
- **Cmd/Ctrl + W**: Close current file
- **Esc**: Close modals and overlays

### AI Command Palette
1. Select code in the editor
2. Press Cmd/Ctrl + L to open the command palette
3. Type natural language instructions
4. Review the generated diff preview
5. Accept or reject the changes

### Error Correction
1. Hover over highlighted errors in the code
2. Click "Fix with AI" when the tooltip appears
3. Review the suggested fix
4. Apply or dismiss the suggestion

### Chat Assistant
1. Click the chat icon in the sidebar or press Cmd/Ctrl + K
2. Ask questions about your code or project
3. Get project-aware responses with code examples
4. Copy code snippets directly from chat responses

## 🔧 Configuration

The editor supports various configuration options through environment variables and config files:

- **AI Service Configuration**: Configure AI backend endpoints
- **Editor Settings**: Customize editor behavior and appearance
- **Keyboard Shortcuts**: Modify default key bindings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by VS Code's extensibility model
- Built with modern React and TypeScript patterns
- UI components powered by Radix UI and Tailwind CSS
`,
    "CHANGELOG.md": `# Changelog

All notable changes to the Nexus Editor project will be documented in this file.

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Nexus Editor
- Inline AI Command Palette with natural language processing
- Nexus Chat Panel with project-aware assistance
- Smart Error Correction with hover tooltips
- Real-time code editor with syntax highlighting
- File system navigation with interactive tree
- Diff preview for AI-generated changes
- Keyboard shortcuts for all major functions
- Responsive design with dark/light theme support

### Features
- React-based architecture with TypeScript
- Modular AI service layer
- Local storage for user preferences
- Framer Motion animations
- Tailwind CSS styling system

### Technical Improvements
- Enhanced mock AI responses for better user experience
- Improved error handling and user feedback
- Optimized component performance
- Better TypeScript type coverage

## [0.9.0] - Development Phase

### Added
- Basic editor functionality
- File management system
- Initial AI integration
- UI component library

### Changed
- Improved code organization
- Enhanced user interface
- Better error handling

### Fixed
- Various bug fixes and improvements
- Performance optimizations
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
            onClick={() => setShowDiffPreview(true)}
          >
            Show Diff Preview
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
          <span className={`${
            errors.filter((e) => e.severity === "error").length > 0 
              ? "text-red-600" 
              : errors.filter((e) => e.severity === "warning").length > 0
                ? "text-amber-600"
                : "text-green-600"
          }`}>
            {errors.filter((e) => e.severity === "error").length} errors,{" "}
            {errors.filter((e) => e.severity === "warning").length} warnings,{" "}
            {errors.filter((e) => e.severity === "info").length} suggestions
          </span>
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.col}
          </span>
          <span className="text-muted-foreground">
            {unsavedChanges.size > 0 ? `${unsavedChanges.size} unsaved` : "All saved"}
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

</initial_code>