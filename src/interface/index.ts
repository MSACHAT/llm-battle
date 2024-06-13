export interface Message {
  content: string;
  type: "query" | "reply";
  createdAt?: number;
  expiredAt?: number; // for image mode
  id: number;
}

export type ModelModel = {
  model_name: string;
  _id: string;
};
export type ConversationMode = "text" | "image";

export type StrategyMode = "polling" | "random";

export type Lang = "zh" | "en";

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  mode?: ConversationMode;
  createdAt: number;
  updatedAt?: number;
}

export interface Prompt {
  act: string;
  prompt: string;
}

export interface RecordCardItem {
  key: string;
  title: string;
  mode: ConversationMode;
  message: string; // last message
  time?: number; // last message time
}

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
