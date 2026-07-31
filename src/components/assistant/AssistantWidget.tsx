"use client";

import { AssistantButton } from "./AssistantButton";
import { AssistantWindow } from "./AssistantWindow";
import { SpeechProvider } from "./tts/SpeechContext";
import { VoiceProvider } from "./voice/VoiceContext";
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
      <VoiceProvider
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
