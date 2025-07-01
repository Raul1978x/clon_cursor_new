import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send, Copy, Bot, User } from "lucide-react";
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
      content:
        "Hello! I'm Nexus AI. How can I help you with your project today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  // Format message content with code highlighting
  const formatMessageContent = (content: string) => {
    // Simple regex to detect code blocks
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${match.index}`} className="whitespace-pre-wrap">
            {content.substring(lastIndex, match.index)}
          </span>,
        );
      }

      // Add code block
      const code = match[1].trim();
      parts.push(
        <div
          key={`code-${match.index}`}
          className="relative my-2 rounded-md bg-muted p-4 font-mono text-sm"
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-6 w-6 p-0"
            onClick={() => copyToClipboard(code)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <pre className="overflow-x-auto">{code}</pre>
        </div>,
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-end`} className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </span>,
      );
    }

    return parts.length > 0 ? (
      parts
    ) : (
      <span className="whitespace-pre-wrap">{content}</span>
    );
  };

  // Enhanced mock response generator with more realistic AI responses
  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes("file") ||
      lowerQuery.includes("open") ||
      lowerQuery.includes("create")
    ) {
      return "I can help you with file operations! Your project has the following structure:\n\n```\nsrc/\n├── components/\n│   ├── home.tsx\n│   └── nexus/\n│       ├── InlineCommandPalette.tsx\n│       ├── NexusChat.tsx\n│       └── ErrorCorrectionTooltip.tsx\n└── utils/\n    └── helpers.ts\n```\n\nYou can:\n- Click on files in the explorer to open them\n- Use Ctrl+S to save changes\n- Use Ctrl+W to close files\n\nWould you like me to help you create a new file or explain any existing code?";
    } else if (lowerQuery.includes("save") || lowerQuery.includes("ctrl+s")) {
      return "To save files in Nexus Editor:\n\n1. **Keyboard shortcut**: Press `Ctrl+S` (or `Cmd+S` on Mac)\n2. **File indicator**: Unsaved files show a dot (•) next to their name\n3. **Auto-save**: Files are automatically marked as modified when you type\n\n```typescript\n// Example of file save handling\nconst saveFile = () => {\n  const newContents = new Map(fileContents);\n  newContents.set(currentFile, code);\n  setFileContents(newContents);\n  console.log(`File ${currentFile} saved!`);\n};\n```\n\nYour changes are preserved in the editor's memory. Would you like to know about other file operations?";
    } else if (
      lowerQuery.includes("authentication") ||
      lowerQuery.includes("auth")
    ) {
      return "I can see your project uses authentication. Here's the main authentication logic:\n\n```typescript\nasync function authenticateUser(email: string, password: string): Promise<AuthResult> {\n  try {\n    const response = await api.post('/auth/login', { email, password });\n    const { token, user } = response.data;\n    \n    // Store token securely\n    localStorage.setItem('auth_token', token);\n    \n    return { success: true, user, token };\n  } catch (error) {\n    return { success: false, error: error.message };\n  }\n}\n```\n\nThis is typically called from your login components. Would you like me to help you implement JWT token refresh or add OAuth integration?";
    } else if (
      lowerQuery.includes("component") ||
      lowerQuery.includes("react")
    ) {
      return "I can help you with React components! Your project structure looks great. Here are some suggestions:\n\n```typescript\n// Example of a reusable component pattern\ninterface ButtonProps {\n  variant: 'primary' | 'secondary';\n  onClick: () => void;\n  children: React.ReactNode;\n}\n\nconst Button = ({ variant, onClick, children }: ButtonProps) => {\n  return (\n    <button \n      className={`btn btn-${variant}`}\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};\n```\n\nWhat specific component would you like help with?";
    } else if (
      lowerQuery.includes("error") ||
      lowerQuery.includes("bug") ||
      lowerQuery.includes("fix")
    ) {
      return "I can help you debug issues! Common patterns I see:\n\n1. **State Management**: Make sure you're using useState correctly\n2. **Effect Dependencies**: Check your useEffect dependency arrays\n3. **Type Safety**: Ensure your TypeScript interfaces match your data\n\n```typescript\n// Common debugging pattern\nconst [data, setData] = useState<DataType | null>(null);\nconst [loading, setLoading] = useState(true);\nconst [error, setError] = useState<string | null>(null);\n\nuseEffect(() => {\n  fetchData()\n    .then(setData)\n    .catch(err => setError(err.message))\n    .finally(() => setLoading(false));\n}, []);\n```\n\nWhat specific error are you encountering?";
    } else if (
      lowerQuery.includes("api") ||
      lowerQuery.includes("endpoint") ||
      lowerQuery.includes("fetch")
    ) {
      return "For API integration, I recommend this pattern:\n\n```typescript\n// API service layer\nclass ApiService {\n  private baseURL = process.env.REACT_APP_API_URL;\n  \n  async get<T>(endpoint: string): Promise<T> {\n    const response = await fetch(`${this.baseURL}${endpoint}`, {\n      headers: {\n        'Authorization': `Bearer ${localStorage.getItem('token')}`,\n        'Content-Type': 'application/json'\n      }\n    });\n    \n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n}\n\nexport const api = new ApiService();\n```\n\nThis provides type safety and centralized error handling. Need help with a specific endpoint?";
    } else if (
      lowerQuery.includes("style") ||
      lowerQuery.includes("css") ||
      lowerQuery.includes("design")
    ) {
      return "For styling, you're using Tailwind CSS which is great! Here are some best practices:\n\n```typescript\n// Use CSS variables for consistent theming\nconst Button = ({ variant }: { variant: 'primary' | 'secondary' }) => (\n  <button className={cn(\n    'px-4 py-2 rounded-md font-medium transition-colors',\n    variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',\n    variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300'\n  )}>\n    Click me\n  </button>\n);\n```\n\nYour shadcn/ui components provide excellent design consistency. What styling challenge can I help with?";
    } else if (
      lowerQuery.includes("performance") ||
      lowerQuery.includes("optimize")
    ) {
      return "Here are some performance optimization tips for your React app:\n\n```typescript\n// 1. Memoize expensive calculations\nconst expensiveValue = useMemo(() => {\n  return heavyComputation(data);\n}, [data]);\n\n// 2. Optimize re-renders\nconst MemoizedComponent = React.memo(({ data }) => {\n  return <div>{data.name}</div>;\n});\n\n// 3. Lazy load components\nconst LazyComponent = lazy(() => import('./HeavyComponent'));\n```\n\nI can also help with bundle analysis, code splitting, or specific performance bottlenecks. What area needs optimization?";
    } else if (lowerQuery.includes("test") || lowerQuery.includes("testing")) {
      return "Testing is crucial! Here's a testing pattern for your components:\n\n```typescript\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { Button } from './Button';\n\ntest('button calls onClick when clicked', () => {\n  const handleClick = jest.fn();\n  render(<Button onClick={handleClick}>Click me</Button>);\n  \n  fireEvent.click(screen.getByText('Click me'));\n  expect(handleClick).toHaveBeenCalledTimes(1);\n});\n```\n\nWould you like help setting up Jest, React Testing Library, or writing specific tests?";
    } else {
      const responses = [
        "I can help you with that! Could you provide more specific details about what you're trying to accomplish?",
        "Based on your codebase, I can assist with React components, TypeScript, API integration, or styling. What would you like to focus on?",
        "I'm analyzing your project structure. It looks like you're building a code editor. What specific functionality are you working on?",
        "I can help with debugging, optimization, or adding new features. What's your current challenge?",
        "Your project uses modern React patterns. I can help with state management, component architecture, or performance optimization. What interests you?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  return (
    <Card className="flex h-full flex-col bg-background">
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Nexus Chat</h2>
          <p className="text-sm text-muted-foreground">
            Project-aware AI assistance
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8">
                    {message.sender === "ai" ? (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=nexus" />
                        <AvatarFallback>
                          <Bot size={16} />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                        <AvatarFallback>
                          <User size={16} />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`mx-2 rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {formatMessageContent(message.content)}
                    <div className="mt-1 text-right text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex flex-row">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=nexus" />
                    <AvatarFallback>
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="mx-2 rounded-lg bg-muted p-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Ask about your project..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Nexus AI has access to your project files and can answer questions
            about your codebase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NexusChat;
