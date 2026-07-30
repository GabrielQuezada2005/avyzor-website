"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/assistant";
import { Bot, User } from "lucide-react";

interface AssistantMessageProps {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";

  return (
    <div
      className={cn(
        "flex gap-3 animate-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-gold-500/20 border border-gold-500/30"
            : "bg-dark-600 border border-white/10"
        )}
      >
        {isUser ? (
          <User size={14} className="text-gold-400" />
        ) : (
          <Bot size={14} className="text-gold-400" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[80%] flex flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
            isUser
              ? "bg-gold-500/15 border border-gold-500/25 text-white rounded-tr-sm"
              : isError
                ? "bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-sm"
                : "bg-dark-700/80 border border-white/5 text-white/90 rounded-tl-sm"
          )}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-white/30 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export function AssistantTypingIndicator() {
  return (
    <div className="flex gap-3 animate-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-600 border border-white/10 flex items-center justify-center">
        <Bot size={14} className="text-gold-400" />
      </div>
      <div className="bg-dark-700/80 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-gold-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gold-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gold-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
