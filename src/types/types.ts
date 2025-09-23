export type Message = {
  id: string;
  text: string;
  sender: "bot" | "user";
  sources: string[];
  timestamp: Date;
  isInitial: boolean;
};

declare global {
  interface Window {
    technetChatbotInitialized: boolean;
  }
}
