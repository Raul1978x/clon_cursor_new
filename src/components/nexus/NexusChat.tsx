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

  // Mock response generator
  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("authentication")) {
      return "The authentication is managed in the `src/auth` directory. The main authentication logic is in `src/auth/authService.ts`. Here's the key function that handles user login:\n\n```typescript\nasync function authenticateUser(email: string, password: string): Promise<AuthResult> {\n  try {\n    const response = await api.post('/auth/login', { email, password });\n    const { token, user } = response.data;\n    \n    // Store token in local storage\n    localStorage.setItem('auth_token', token);\n    \n    return {\n      success: true,\n      user,\n      token\n    };\n  } catch (error) {\n    return {\n      success: false,\n      error: error.message || 'Authentication failed'\n    };\n  }\n}\n```\n\nThis function is called from the login form component at `src/components/LoginForm.tsx`.";
    } else if (
      query.toLowerCase().includes("api") ||
      query.toLowerCase().includes("endpoint")
    ) {
      return "The API endpoints are defined in `src/api/endpoints.ts`. The API client setup is in `src/api/client.ts` which uses Axios for HTTP requests.";
    } else {
      return "I'm not sure about that specific detail in your project. Could you provide more context or ask about a different aspect of your codebase?";
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
