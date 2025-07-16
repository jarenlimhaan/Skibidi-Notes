"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Square } from "lucide-react";

import Navbar from "@/components/navbar2";

export default function ChatBot() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [messages, setMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [showThinking, setShowThinking] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowThinking(true);

    const formData = new FormData();
    formData.append("question", input);

    try {
      const response = await fetch(backendURL + "/api/chat/ask", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();
      const fullMessage = result;

      setShowThinking(false);
      setPendingMessage("");

      let index = 0;
      const typingSpeed = 20;

      typingIntervalRef.current = setInterval(() => {
        setPendingMessage((prev) => (prev ?? "") + fullMessage[index]);
        index++;

        if (index >= fullMessage.length) {
          clearInterval(typingIntervalRef.current!);
          typingIntervalRef.current = null;

          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: fullMessage,
            },
          ]);

          setPendingMessage(null);
          setIsLoading(false);
        }
      }, typingSpeed);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      setShowThinking(false);
    }
  };

  const stop = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;

      if (pendingMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: pendingMessage,
          },
        ]);
      }

      setPendingMessage(null);
    }

    setIsLoading(false);
    setShowThinking(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
    inputRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingMessage, showThinking]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <Navbar />

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Hi, they call me the OhioRizzler. Rizz me up with your questions!
              </h2>
              <p className="text-gray-500">
                Flush your doubts into the chat box below!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 bg-blue-600">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-black" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border shadow-sm"
                }`}
              >
                <p
                  className={`whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-gray-800"}`}
                >
                  {message.content}
                </p>
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-gray-600">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-black" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* AI is thinking... */}
          {showThinking && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 bg-blue-600">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white border shadow-sm p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    AI is thinking...
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* Typing animation */}
          {pendingMessage && (
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 bg-blue-600">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white border shadow-sm p-4">
                <p className="whitespace-pre-wrap text-gray-800">
                  {pendingMessage}
                </p>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-transparent px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
                placeholder="Unleash your baggages..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none min-h-[44px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e as any);
                  }
                }}
              />
            </div>
            {isLoading ? (
              <Button
                type="button"
                onClick={stop}
                variant="outline"
                size="icon"
                className="h-11 w-11 bg-transparent"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-11 w-11"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
