/**
 * TechNet Chatbot Widget Component
 * Main class implementing the chatbot widget with Shadow DOM encapsulation
 */

import { CONFIG } from "../config/config.js";
import { render } from "./ChatWidgetUI.js";
import { bindEvents } from "./ChatWidgetEvents.js";
import {
  addMessage,
  showTypingIndicator,
  hideTypingIndicator,
  showNotification,
} from "./ChatWidgetMessages.js";
import { mockAPI } from "../api/mockApi.js";

export class ChatWidget extends HTMLElement {
  constructor() {
    super();

    // Create shadow root for encapsulation
    this.shadow = this.attachShadow({ mode: "open" });

    // Initialize state
    this.isOpen = false;
    this.messageHistory = [];
    this.isTyping = false;
    this.typingIndicator = null;

    // Bind methods to preserve 'this' context
    this.toggleChat = this.toggleChat.bind(this);
    this.openChat = this.openChat.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Lifecycle method called when the element is added to the document
   */
  connectedCallback() {
    render(this);
    bindEvents(this);

    // Add initial message
    addMessage(this, CONFIG.messages.initial, "bot", [], true);
  }

  /**
   * Handles keydown events for accessibility
   * @param {KeyboardEvent} e - The keyboard event
   */
  handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggleChat();
    }
  }

  /**
   * Toggles the chat window visibility
   */
  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  /**
   * Opens the chat window
   */
  openChat() {
    this.isOpen = true;
    this.window.style.display = "flex";
    this.trigger.classList.add("open");
    this.trigger.setAttribute("aria-expanded", "true");

    // Focus the input field
    setTimeout(() => {
      this.inputField.focus();
    }, 300);
  }

  /**
   * Closes the chat window
   */
  closeChat() {
    this.isOpen = false;
    this.window.style.display = "none";
    this.trigger.classList.remove("open");
    this.trigger.setAttribute("aria-expanded", "false");
  }

  /**
   * Sends a message from the user
   */
  async sendMessage() {
    const message = this.inputField.value.trim();
    if (!message || this.isTyping) return;

    // Add user message
    addMessage(this, message, "user");
    this.inputField.value = "";
    this.inputField.style.height = "auto";

    // Show typing indicator
    showTypingIndicator(this);

    try {
      const response = await mockAPI(message);
      hideTypingIndicator(this);
      addMessage(this, response.text, "bot", response.sources);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      hideTypingIndicator(this);
      addMessage(this, CONFIG.messages.error, "bot");
      showNotification(this, "Connection error. Please try again.");
    }
  }
}

export default ChatWidget;
