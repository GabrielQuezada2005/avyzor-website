export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sent" | "pending" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
}

export interface QuickReply {
  id: string;
  label: string;
  message: string;
}

export interface AssistantIntent {
  id: string;
  keywords: string[];
  response: string;
}

export interface AssistantConfig {
  name: string;
  tagline: string;
  welcomeMessage: string;
  placeholder: string;
  offlineMessage: string;
  quickReplies: QuickReply[];
  intents: AssistantIntent[];
  fallbackResponses: string[];
}

export interface AssistantState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
}

export interface AssistantActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export type UseAssistantReturn = AssistantState & AssistantActions;
