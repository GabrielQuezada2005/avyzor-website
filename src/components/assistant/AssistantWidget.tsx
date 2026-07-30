"use client";

import { AssistantButton } from "./AssistantButton";
import { AssistantWindow } from "./AssistantWindow";
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
    <>
      <AssistantWindow
        isOpen={isOpen}
        messages={messages}
        isTyping={isTyping}
        onClose={close}
        onSend={sendMessage}
        onClear={clearMessages}
      />
      <AssistantButton isOpen={isOpen} onClick={toggle} />
    </>
  );
}
