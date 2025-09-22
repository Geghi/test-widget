/**
 * TechNet Chatbot Widget Component
 * Main class implementing the chatbot widget with Shadow DOM encapsulation
 */

import { CONFIG } from "../config/config.js";
import {
  createElement,
  formatTime,
  scrollToBottom,
  autoResizeTextarea,
} from "../utils/dom.js";
import { sanitizeHTML, sanitizeURL } from "../utils/sanitizer.js";
import { debounce, generateId, isMobile } from "../utils/helpers.js";
import { mockAPI } from "../api/mockApi.js";
import { getStyles } from "./styles.js";

export class ChatWidget extends HTMLElement {
  constructor() {
    super();

    // Create shadow root for encapsulation
    this.shadow = this.attachShadow({ mode: "open" });

    // Initialize state
    this.isOpen = false;
    this.isMinimized = false;
    this.messageHistory = [];
    this.isTyping = false;
    this.typingIndicator = null;

    // Bind methods to preserve 'this' context
    this.toggleChat = this.toggleChat.bind(this);
    this.openChat = this.openChat.bind(this);
    this.closeChat = this.closeChat.bind(this);
    this.toggleMinimize = this.toggleMinimize.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  /**
   * Lifecycle method called when the element is added to the document
   */
  connectedCallback() {
    this.render();
    this.bindEvents();

    // Add initial message
    this.addMessage(CONFIG.messages.initial, "bot", [], true);
  }

  /**
   * Renders the widget UI within the shadow DOM
   */
  render() {
    // Add styles to shadow DOM
    const style = createElement("style");
    style.textContent = getStyles();
    this.shadow.appendChild(style);

    // Create widget container
    const container = createElement("div", "technet-chatbot");

    // Create trigger button
    this.trigger = createElement("button", "technet-chatbot-trigger");
    this.trigger.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    `;
    this.trigger.setAttribute("aria-label", "Open TechNet Chat Assistant");
    this.trigger.setAttribute("role", "button");
    this.trigger.setAttribute("tabindex", "0");

    // Create chat window
    this.window = createElement("div", "technet-chatbot-window");
    this.window.setAttribute("role", "dialog");
    this.window.setAttribute("aria-label", "TechNet Chat Assistant");

    // Create header
    const header = createElement("div", "technet-chatbot-header");
    header.innerHTML = `
      <div class="technet-chatbot-title">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        TechNet Assistant
      </div>
      <div class="technet-chatbot-controls">
        <button class="technet-chatbot-control-btn minimize-btn" aria-label="Minimize chat">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        <button class="technet-chatbot-control-btn close-btn" aria-label="Close chat">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    `;

    // Create messages container
    this.messagesContainer = createElement("div", "technet-chatbot-messages");
    this.messagesContainer.setAttribute("role", "log");
    this.messagesContainer.setAttribute("aria-live", "polite");

    // Create input area
    const inputArea = createElement("div", "technet-chatbot-input");
    inputArea.innerHTML = `
      <div class="technet-input-wrapper">
        <textarea class="technet-input-field" placeholder="${CONFIG.messages.placeholder}" rows="1" maxlength="1000" aria-label="Message input"></textarea>
        <button class="technet-send-btn" aria-label="Send message">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;

    // Assemble the window
    this.window.appendChild(header);
    this.window.appendChild(this.messagesContainer);
    this.window.appendChild(inputArea);

    // Add to container
    container.appendChild(this.trigger);
    container.appendChild(this.window);

    // Add container to shadow DOM
    this.shadow.appendChild(container);

    // Store references to elements
    this.inputField = this.window.querySelector(".technet-input-field");
    this.sendBtn = this.window.querySelector(".technet-send-btn");
    this.minimizeBtn = this.window.querySelector(".minimize-btn");
    this.closeBtn = this.window.querySelector(".close-btn");
  }

  /**
   * Binds event listeners to widget elements
   */
  bindEvents() {
    // Trigger button
    this.trigger.addEventListener("click", this.toggleChat);
    this.trigger.addEventListener("keydown", this.handleKeyDown);

    // Control buttons
    this.closeBtn.addEventListener("click", this.closeChat);
    this.minimizeBtn.addEventListener("click", this.toggleMinimize);

    // Input handling
    this.inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.inputField.addEventListener("input", () => {
      autoResizeTextarea(this.inputField);
    });

    this.sendBtn.addEventListener("click", this.sendMessage);

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closeChat();
      }
    });

    // Click outside to close (optional)
    document.addEventListener("click", this.handleOutsideClick);

    // Handle window resize for mobile responsiveness
    window.addEventListener(
      "resize",
      debounce(() => {
        if (this.isOpen && isMobile()) {
          // Adjust for mobile
        }
      }, 250)
    );
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
   * Handles clicks outside the widget
   * @param {MouseEvent} e - The mouse event
   */
  handleOutsideClick(e) {
    if (
      this.isOpen &&
      !this.window.contains(e.target) &&
      !this.trigger.contains(e.target)
    ) {
      // Uncomment the next line if you want click-outside-to-close behavior
      // this.closeChat();
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

    scrollToBottom(this.messagesContainer);
  }

  /**
   * Closes the chat window
   */
  closeChat() {
    this.isOpen = false;
    this.isMinimized = false;
    this.window.style.display = "none";
    this.window.classList.remove("minimized");
    this.trigger.classList.remove("open");
    this.trigger.setAttribute("aria-expanded", "false");
  }

  /**
   * Toggles the minimized state of the chat window
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.window.classList.add("minimized");
      this.minimizeBtn.innerHTML = `
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 9v4H6V9h12m0-2H6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
        </svg>
      `;
      this.minimizeBtn.setAttribute("aria-label", "Restore chat");
    } else {
      this.window.classList.remove("minimized");
      this.minimizeBtn.innerHTML = `
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13H5v-2h14v2z"/>
        </svg>
      `;
      this.minimizeBtn.setAttribute("aria-label", "Minimize chat");
      scrollToBottom(this.messagesContainer);
    }
  }

  /**
   * Sends a message from the user
   */
  async sendMessage() {
    const message = this.inputField.value.trim();
    if (!message || this.isTyping) return;

    // Add user message
    this.addMessage(message, "user");
    this.inputField.value = "";
    this.inputField.style.height = "auto";

    // Show typing indicator
    this.showTypingIndicator();

    try {
      const response = await mockAPI(message);
      this.hideTypingIndicator();
      this.addMessage(response.text, "bot", response.sources);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      this.hideTypingIndicator();
      this.addMessage(CONFIG.messages.error, "bot");
      this.showNotification("Connection error. Please try again.");
    }
  }

  /**
   * Adds a message to the chat
   * @param {string} text - The message text
   * @param {string} sender - The sender ("user" or "bot")
   * @param {Array} sources - Array of source URLs
   * @param {boolean} isInitial - Whether this is the initial message
   */
  addMessage(text, sender, sources = [], isInitial = false) {
    const message = {
      id: generateId(),
      text: sanitizeHTML(text),
      sender,
      sources: sources || [],
      timestamp: new Date(),
      isInitial,
    };

    this.messageHistory.push(message);

    const messageElement = this.createMessageElement(message);
    this.messagesContainer.appendChild(messageElement);

    if (!isInitial) {
      scrollToBottom(this.messagesContainer);
    }
  }

  /**
   * Creates a message element
   * @param {Object} message - The message object
   * @returns {HTMLElement} The message element
   */
  createMessageElement(message) {
    const messageDiv = createElement(
      "div",
      `technet-message ${message.sender}`
    );
    messageDiv.setAttribute("data-message-id", message.id);

    const avatar = createElement("div", "technet-message-avatar");
    avatar.textContent = message.sender === "bot" ? "TN" : "U";

    const contentWrapper = createElement("div");
    const content = createElement("div", "technet-message-content");
    content.textContent = message.text;

    const time = createElement("div", "technet-message-time");
    time.textContent = formatTime(message.timestamp);

    contentWrapper.appendChild(content);
    contentWrapper.appendChild(time);

    // Add sources if available
    if (message.sources && message.sources.length > 0) {
      const sourcesDiv = createElement("div", "technet-message-sources");

      // Create sources list
      const sourcesList = createElement("ul", "technet-sources-list");
      message.sources.forEach((source) => {
        const sanitizedSource = sanitizeURL(source);
        if (sanitizedSource) {
          const listItem = createElement("li");
          const link = createElement("a");
          link.href = sanitizedSource;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = sanitizedSource;
          listItem.appendChild(link);
          sourcesList.appendChild(listItem);
        }
      });

      if (sourcesList.children.length > 0) {
        const sourcesTitle = createElement("div", "technet-sources-title");
        sourcesTitle.textContent = "Sources:";
        sourcesDiv.appendChild(sourcesTitle);
        sourcesDiv.appendChild(sourcesList);
        contentWrapper.appendChild(sourcesDiv);
      }
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentWrapper);

    return messageDiv;
  }

  /**
   * Shows the typing indicator
   */
  showTypingIndicator() {
    if (this.typingIndicator) return;

    this.isTyping = true;
    this.sendBtn.disabled = true;

    this.typingIndicator = createElement("div", "technet-message bot");
    this.typingIndicator.innerHTML = `
      <div class="technet-message-avatar">TN</div>
      <div class="technet-message-content">
        <div class="technet-typing-indicator">
          <span>${CONFIG.messages.thinking}</span>
          <div class="technet-typing-dots">
            <div class="technet-typing-dot"></div>
            <div class="technet-typing-dot"></div>
            <div class="technet-typing-dot"></div>
          </div>
        </div>
      </div>
    `;

    this.messagesContainer.appendChild(this.typingIndicator);
    scrollToBottom(this.messagesContainer);
  }

  /**
   * Hides the typing indicator
   */
  hideTypingIndicator() {
    if (this.typingIndicator) {
      this.typingIndicator.remove();
      this.typingIndicator = null;
    }
    this.isTyping = false;
    this.sendBtn.disabled = false;
  }

  /**
   * Shows a notification message
   * @param {string} message - The notification message
   */
  showNotification(message) {
    const notification = createElement("div", "technet-notification");
    notification.textContent = sanitizeHTML(message);
    this.shadow.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }
}

export default ChatWidget;
