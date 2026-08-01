"use client";

import { useCallback, useRef, useState } from "react";
import {
  AssistantApiError,
  createAssistantSessionId,
  createMessageId,
  createWelcomeMessage,
  generateAssistantResponse,
  type ChatMessage,
  type UseAssistantReturn,
} from "@/lib/assistant";

interface UseAssistantOptions {
  welcomeMessage?: string;
  locale?: string;
}

export function useAssistant(options?: UseAssistantOptions): UseAssistantReturn {
  const welcomeMessage = options?.welcomeMessage;
  const locale = options?.locale;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(welcomeMessage),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const messagesRef = useRef(messages);
  const sessionIdRef = useRef(createAssistantSessionId());

  messagesRef.current = messages;

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearMessages = useCallback(() => {
    sessionIdRef.current = createAssistantSessionId();
    setMessages([createWelcomeMessage(welcomeMessage)]);
    setError(null);
  }, [welcomeMessage]);

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
      const { message: response } = await generateAssistantResponse(
        trimmed,
        conversationHistory,
        sessionIdRef.current,
        locale
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
  }, [locale]);

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
