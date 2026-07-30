"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { ASSISTANT_CONFIG } from "@/lib/assistant";
import { AssistantMessage, AssistantTypingIndicator } from "./AssistantMessage";
import { AssistantInput } from "./AssistantInput";
import type { ChatMessage, QuickReply } from "@/lib/assistant";

interface AssistantWindowProps {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  onClear: () => void;
  quickReplies?: QuickReply[];
}

export function AssistantWindow({
  isOpen,
  messages,
  isTyping,
  onClose,
  onSend,
  onClear,
  quickReplies = ASSISTANT_CONFIG.quickReplies,
}: AssistantWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const showQuickReplies =
    messages.length <= 1 && !isTyping;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-44 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[min(600px,calc(100vh-12rem))] flex flex-col glass-gold rounded-2xl shadow-premium overflow-hidden border border-gold-500/20"
          role="dialog"
          aria-label="AVYZOR Assistant Chat"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-dark-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                <Sparkles size={18} className="text-dark-900" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {ASSISTANT_CONFIG.name}
                </h3>
                <p className="text-gold-400/80 text-xs">
                  {ASSISTANT_CONFIG.tagline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onClear}
                aria-label="Chat zurücksetzen"
                className="p-2 text-white/40 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Chat schließen"
                className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Demo badge */}
          <div className="px-5 py-2 bg-gold-500/5 border-b border-gold-500/10">
            <p className="text-[11px] text-gold-400/70 text-center">
              Demo-Modus · Regelbasierte Antworten · KI-Integration folgt
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[280px] max-h-[400px]">
            {messages.map((message) => (
              <AssistantMessage key={message.id} message={message} />
            ))}
            {isTyping && <AssistantTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => onSend(reply.message)}
                  className="px-3 py-1.5 text-xs font-medium text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full hover:bg-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-dark-800/40">
            <AssistantInput
              onSend={onSend}
              disabled={isTyping}
              placeholder={ASSISTANT_CONFIG.placeholder}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
