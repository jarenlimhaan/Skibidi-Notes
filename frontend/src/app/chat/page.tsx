"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Square } from "lucide-react"

import Navbar from "@/components/navbar"

export default function ChatBot() {
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith('0:"') && line.endsWith('"')) {
              const char = line.slice(3, -1)
              assistantMessage.content += char
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id ? { ...msg, content: assistantMessage.content } : msg,
                ),
              )
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const stop = () => {
    setIsLoading(false)
  }
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setIsTyping(isLoading)
  }, [isLoading])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
        <Navbar/>
      {/* Header */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">How can I help you today?</h2>
              <p className="text-gray-500">Start a conversation by typing a message below.</p>
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
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[80%] p-4 ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <p className={`whitespace-pre-wrap ${message.role === "user" ? "text-white" : "text-gray-800"}`}>
                    {message.content}
                  </p>
                </div>
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-gray-600">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
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
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="pr-12 min-h-[44px] resize-none"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    onSubmit(e as any)
                  }
                }}
              />
            </div>

            {isLoading ? (
              <Button type="button" onClick={stop} variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="h-11 w-11">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send, Shift + Enter for new line</p>
        </div>
      </div>
    </div>
  )
}
