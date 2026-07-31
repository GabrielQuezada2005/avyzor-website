"use client";

import { useCallback, useRef, useState } from "react";
import {
  AssistantApiError,
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
  const messagesRef = useRef(messages);

  messagesRef.current = messages;

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

    const conversationHistory = [...messagesRef.current, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await generateAssistantResponse(
        trimmed,
        conversationHistory
      );

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof AssistantApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unbekannter Fehler beim Senden der Nachricht.";

      setError(errorMessage);

      const assistantErrorMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
        status: "error",
      };

      setMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setIsTyping(false);
      isProcessingRef.current = false;
    }
  }, []);

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
