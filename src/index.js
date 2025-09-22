/**
 * TechNet Chatbot Widget Entry Point
 * Main entry file that initializes the chatbot widget
 */

import { ChatWidget } from "./components/ChatWidget.js";

// Define the custom element
customElements.define("technet-chatbot", ChatWidget);

// Initialize when DOM is ready
function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Create and attach the widget to the document
      const widget = document.createElement("technet-chatbot");
      document.body.appendChild(widget);
    });
  } else {
    // Create and attach the widget to the document
    const widget = document.createElement("technet-chatbot");
    document.body.appendChild(widget);
  }
}

// Prevent multiple initialization
if (!window.technetChatbotInitialized) {
  window.technetChatbotInitialized = true;
  init();
}

// Export for potential external use
export { ChatWidget };
export default ChatWidget;
