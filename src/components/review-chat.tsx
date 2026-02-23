"use client";

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, MessageSquare } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ReviewChatProps {
  reviewId: string;
}

export function ReviewChat({ reviewId }: ReviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    sendMessage.mutate({
      reviewId,
      message: userMessage,
      conversationHistory: messages,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="bg-black border-zinc-800">
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
          <CardTitle className="text-lg">Ask About This Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[450px] overflow-y-auto scrollbar-custom relative">
          {messages.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ userSelect: 'none', pointerEvents: 'none' }}>
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-400 mb-1">Ask questions about this review</p>
              <p className="text-xs text-zinc-600 max-w-xs">
                Get clarification on findings, understand risk scores, or ask for implementation advice
              </p>
            </div>
          )}
          <div className="p-6 space-y-4">
            {messages.length > 0 && (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-white text-black"
                          : "bg-zinc-900 text-zinc-100 border border-zinc-800"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sendMessage.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        <span className="text-sm text-zinc-400">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={sendMessage.isPending}
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 placeholder:text-zinc-600"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessage.isPending}
              size="icon"
              className="shrink-0"
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
