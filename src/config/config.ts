/**
 * Configuration for the TechNet Chatbot Widget
 * Contains all customizable settings for the widget appearance and behavior
 */

interface MessagesConfig {
  initial: string;
  placeholder: string;
  error: string;
  thinking: string;
}

interface AnimationConfig {
  duration: number;
  easing: string;
}

interface ColorsConfig {
  primary: string;
  secondary: string;
  text: string;
  textLight: string;
  background: string;
  userMessage: string;
  botMessage: string;
  shadow: string;
}

interface DimensionsConfig {
  windowWidth: number;
  windowHeight: number;
  mobileBreakpoint: number;
}

interface ChatWidgetConfig {
  position: string;
  colors: ColorsConfig;
  animation: AnimationConfig;
  messages: MessagesConfig;
  dimensions: DimensionsConfig;
}

export const CONFIG: ChatWidgetConfig = {
  position: "bottom-right",
  colors: {
    primary: "#11404B", // Matching TechNet's teal color
    secondary: "#FF5C00", // Orange accent from the website
    text: "#333333",
    textLight: "#666666",
    background: "#ffffff",
    userMessage: "#e8f4f8",
    botMessage: "#f5f5f5",
    shadow: "rgba(0,0,0,0.15)",
  },
  animation: {
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  messages: {
    initial:
      "Hello! I'm the TechNet assistant. I can help you with information about immunization programs, guidelines, and resources. How can I assist you today?",
    placeholder: "Type your message here...",
    error:
      "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
    thinking: "Thinking...",
  },
  dimensions: {
    windowWidth: 380,
    windowHeight: 500,
    mobileBreakpoint: 768,
  },
};

export default CONFIG;
