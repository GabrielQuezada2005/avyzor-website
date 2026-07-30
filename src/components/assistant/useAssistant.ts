"use client";

import { useCallback, useRef, useState } from "react";
import {
  ASSISTANT_CONFIG,
  createMessageId,
  createWelcomeMessage,
  generateAssistantResponse,
  type ChatMessage,
  type UseAssistantReturn,
} from "@/lib/assistant";

export function useAssistant(): UseAssistantReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearMessages = useCallback(() => {
    setMessages([createWelcomeMessage()]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setError(null);

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await generateAssistantResponse(trimmed, [
        ...messages,
        userMessage,
      ]);

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError(ASSISTANT_CONFIG.offlineMessage);
      const errorMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: ASSISTANT_CONFIG.offlineMessage,
        timestamp: new Date(),
        status: "error",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      isProcessingRef.current = false;
    }
  }, [messages]);

  return {
    isOpen,
    messages,
    isTyping,
    error,
    open,
    close,
    toggle,
    sendMessage,
    clearMessages,
  };
}
