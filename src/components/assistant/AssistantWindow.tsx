"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { ASSISTANT_QUICK_REPLY_IDS } from "@/lib/i18n/structures";
import { AssistantMessage, AssistantTypingIndicator } from "./AssistantMessage";
import { AssistantVoiceInput } from "./voice/AssistantVoiceInput";
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
  quickReplies: quickRepliesProp,
}: AssistantWindowProps) {
  const t = useTranslations("assistant");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = useMemo(
    () =>
      quickRepliesProp ??
      ASSISTANT_QUICK_REPLY_IDS.map((id) => ({
        id,
        label: t(`quickReplies.${id}.label`),
        message: t(`quickReplies.${id}.message`),
      })),
    [quickRepliesProp, t]
  );

  const showQuickReplies = messages.length <= 1 && !isTyping;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label={t("window.overlayClose")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-dark-950/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-44 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] max-h-[min(620px,calc(100vh-12rem))] flex flex-col glass-premium-chat rounded-2xl overflow-hidden"
            role="dialog"
            aria-label={t("window.ariaLabel")}
            aria-modal="true"
          >
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-gold-500/10 bg-dark-800/60">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
                  <Sparkles size={18} className="text-dark-900" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {t("name")}
                  </h3>
                  <p className="text-gold-400/80 text-xs">
                    {t("tagline")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onClear}
                  aria-label={t("buttons.reset")}
                  className="p-2 text-white/40 hover:text-gold-400 transition-colors rounded-lg hover:bg-white/5"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t("buttons.close")}
                  className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-5 py-2 bg-gold-500/5 border-b border-gold-500/10">
              <p className="text-[11px] text-gold-400/70 text-center">
                {t("statusMessage")}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[280px] max-h-[400px]">
              {messages.map((message, index) => (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  index={index}
                />
              ))}
              <AnimatePresence>
                {isTyping && <AssistantTypingIndicator />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {showQuickReplies && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="px-4 pb-3 flex flex-wrap gap-2"
              >
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
              </motion.div>
            )}

            <div className="px-4 pb-4 pt-2 border-t border-gold-500/10 bg-dark-800/50">
              <AssistantVoiceInput
                onSend={onSend}
                disabled={isTyping}
                placeholder={t("placeholder")}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
