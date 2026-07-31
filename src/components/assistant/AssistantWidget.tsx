"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AssistantButton } from "./AssistantButton";
import { AssistantWindow } from "./AssistantWindow";
import { SpeechProvider } from "./tts/SpeechContext";
import { VoiceProvider } from "./voice/VoiceContext";
import { useAssistant } from "./useAssistant";

export function AssistantWidget() {
  const locale = useLocale();
  const t = useTranslations("assistant");

  const {
    isOpen,
    messages,
    isTyping,
    toggle,
    close,
    sendMessage,
    clearMessages,
  } = useAssistant({
    welcomeMessage: t("welcomeMessage"),
    locale,
  });

  const prevLocaleRef = useRef(locale);

  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      prevLocaleRef.current = locale;
      clearMessages();
    }
  }, [locale, clearMessages]);

  return (
    <SpeechProvider>
      <VoiceProvider
        siteLocale={locale}
        messages={messages}
        isTyping={isTyping}
        onSend={sendMessage}
      >
        <AssistantWindow
          isOpen={isOpen}
          messages={messages}
          isTyping={isTyping}
          onClose={close}
          onSend={sendMessage}
          onClear={clearMessages}
        />
        <AssistantButton isOpen={isOpen} onClick={toggle} />
      </VoiceProvider>
    </SpeechProvider>
  );
}
