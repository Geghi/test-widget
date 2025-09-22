/**
 * Configuration for the TechNet Chatbot Widget
 * Contains all customizable settings for the widget appearance and behavior
 */

export const CONFIG = {
  position: "bottom-right",
  colors: {
    primary: "#2c5f5f", // Matching TechNet's teal color
    secondary: "#ff6600", // Orange accent from the website
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
