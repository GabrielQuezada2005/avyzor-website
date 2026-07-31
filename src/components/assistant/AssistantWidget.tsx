"use client";

import { AssistantButton } from "./AssistantButton";
import { AssistantWindow } from "./AssistantWindow";
import { SpeechProvider } from "./tts/SpeechContext";
import { useAssistant } from "./useAssistant";

export function AssistantWidget() {
  const {
    isOpen,
    messages,
    isTyping,
    toggle,
    close,
    sendMessage,
    clearMessages,
  } = useAssistant();

  return (
    <SpeechProvider>
      <AssistantWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        onClose={close}
        onSend={sendMessage}
        onClear={clearMessages}
      />
      <AssistantButton isOpen={isOpen} onClick={toggle} />
    </SpeechProvider>
  );
}
