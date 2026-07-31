"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AssistantInput({
  onSend,
  disabled = false,
  placeholder = "Ihre Nachricht eingeben…",
}: AssistantInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        aria-label="Chat-Nachricht"
        className={cn(
          "w-full resize-none bg-dark-700/60 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/30",
          "focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "max-h-24 overflow-y-auto"
        )}
      />
      <motion.button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Nachricht senden"
        whileHover={value.trim() && !disabled ? { scale: 1.05 } : undefined}
        whileTap={value.trim() && !disabled ? { scale: 0.92 } : undefined}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
          value.trim() && !disabled
            ? "bg-gold-gradient text-dark-900 hover:shadow-gold"
            : "bg-dark-600 text-white/30 cursor-not-allowed"
        )}
      >
        <Send size={14} />
      </motion.button>
    </form>
  );
}
