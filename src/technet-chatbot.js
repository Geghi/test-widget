(function () {
  "use strict";

  // Configuration
  const CONFIG = {
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
  };

  // Mock API function
  async function mockAPI(message) {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Simulate occasional errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    // Mock responses with sources
    const responses = [
      {
        text: "Based on current WHO guidelines, routine immunization schedules should be maintained even during health emergencies. It's crucial to ensure continued protection against vaccine-preventable diseases.",
        sources: [
          "https://www.who.int/immunization/policy/position_papers/en/",
          "https://www.cdc.gov/vaccines/schedules/index.html",
        ],
      },
      {
        text: "The global immunization coverage has shown improvement over recent years, with over 85% of children worldwide receiving basic vaccines. However, equity gaps remain in underserved populations.",
        sources: [
          "https://www.who.int/news-room/fact-sheets/detail/immunization-coverage",
          "https://data.unicef.org/topic/child-health/immunization/",
        ],
      },
      {
        text: "Cold chain management is critical for vaccine effectiveness. Vaccines should be stored between 2-8°C and monitored continuously to ensure potency.",
        sources: [
          "https://www.who.int/immunization/programmes_systems/supply_chain/resources/en/",
          "https://www.cdc.gov/vaccines/hcp/admin/storage/guide.html",
        ],
      },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Utility functions
  function createElement(tag, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  function formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Chatbot Widget Class
  class TechNetChatbot {
    constructor() {
      this.isOpen = false;
      this.isMinimized = false;
      this.messageHistory = [];
      this.isTyping = false;

      this.init();
    }

    init() {
      this.createStyles();
      this.createWidget();
      this.bindEvents();

      // Add initial message
      this.addMessage(CONFIG.messages.initial, "bot", [], true);
    }

    createStyles() {
      const styles = `
                .technet-chatbot * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .technet-chatbot-trigger {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, #3a7a7a 100%);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 20px ${CONFIG.colors.shadow};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
                    z-index: 10000;
                    border: none;
                    outline: none;
                }

                .technet-chatbot-trigger:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 25px ${CONFIG.colors.shadow};
                }

                .technet-chatbot-trigger:active {
                    transform: scale(0.95);
                }

                .technet-chatbot-trigger svg {
                    width: 28px;
                    height: 28px;
                    fill: white;
                    transition: transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
                }

                .technet-chatbot-trigger.open svg {
                    transform: rotate(180deg);
                }

                .technet-chatbot-window {
                    position: fixed;
                    bottom: 100px;
                    right: 24px;
                    width: 380px;
                    height: 500px;
                    background: ${CONFIG.colors.background};
                    border-radius: 16px;
                    box-shadow: 0 10px 40px ${CONFIG.colors.shadow};
                    display: none;
                    flex-direction: column;
                    z-index: 9999;
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: slideUp ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .technet-chatbot-header {
                    background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, #3a7a7a 100%);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .technet-chatbot-title {
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .technet-chatbot-controls {
                    display: flex;
                    gap: 8px;
                }

                .technet-chatbot-control-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background ${CONFIG.animation.duration}ms ease;
                }

                .technet-chatbot-control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .technet-chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    scroll-behavior: smooth;
                }

                .technet-chatbot-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .technet-chatbot-messages::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .technet-chatbot-messages::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .technet-message {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    animation: messageSlideIn 0.3s ease-out;
                }

                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .technet-message.user {
                    flex-direction: row-reverse;
                }

                .technet-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .technet-message.bot .technet-message-avatar {
                    background: ${CONFIG.colors.primary};
                    color: white;
                }

                .technet-message.user .technet-message-avatar {
                    background: ${CONFIG.colors.secondary};
                    color: white;
                }

                .technet-message-content {
                    max-width: 70%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }

                .technet-message.bot .technet-message-content {
                    background: ${CONFIG.colors.botMessage};
                    color: ${CONFIG.colors.text};
                    border-bottom-left-radius: 6px;
                }

                .technet-message.user .technet-message-content {
                    background: ${CONFIG.colors.userMessage};
                    color: ${CONFIG.colors.text};
                    border-bottom-right-radius: 6px;
                }

                .technet-message-time {
                    font-size: 11px;
                    color: ${CONFIG.colors.textLight};
                    margin-top: 4px;
                }

                .technet-message-sources {
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: rgba(44, 95, 95, 0.05);
                    border-radius: 8px;
                    border-left: 3px solid ${CONFIG.colors.primary};
                }

                .technet-sources-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: ${CONFIG.colors.primary};
                    margin-bottom: 4px;
                }

                .technet-sources-list {
                    list-style: none;
                    font-size: 11px;
                }

                .technet-sources-list li {
                    margin-bottom: 2px;
                }

                .technet-sources-list a {
                    color: ${CONFIG.colors.primary};
                    text-decoration: none;
                    word-break: break-all;
                }

                .technet-sources-list a:hover {
                    text-decoration: underline;
                }

                .technet-typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: ${CONFIG.colors.textLight};
                    font-size: 12px;
                }

                .technet-typing-dots {
                    display: flex;
                    gap: 2px;
                }

                .technet-typing-dot {
                    width: 4px;
                    height: 4px;
                    background: ${CONFIG.colors.textLight};
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite ease-in-out;
                }

                .technet-typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .technet-typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typingDot {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }
                    30% {
                        transform: translateY(-8px);
                        opacity: 1;
                    }
                }

                .technet-chatbot-input {
                    padding: 16px 20px;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }

                .technet-input-wrapper {
                    flex: 1;
                    position: relative;
                }

                .technet-input-field {
                    width: 100%;
                    min-height: 20px;
                    max-height: 80px;
                    padding: 12px 16px;
                    padding-right: 60px;
                    border: 2px solid #e0e0e0;
                    border-radius: 20px;
                    font-size: 14px;
                    font-family: inherit;
                    resize: none;
                    outline: none;
                    transition: border-color 0.2s ease;
                    overflow-y: auto;
                }

                .technet-input-field:focus {
                    border-color: ${CONFIG.colors.primary};
                }

                .technet-input-field::placeholder {
                    color: ${CONFIG.colors.textLight};
                }

                .technet-send-btn {
                    width: 40px;
                    height: 40px;
                    background: ${CONFIG.colors.primary};
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .technet-send-btn:hover:not(:disabled) {
                    background: #3a7a7a;
                    transform: scale(1.05);
                }

                .technet-send-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }

                .technet-notification {
                    position: fixed;
                    bottom: 80px;
                    right: 100px;
                    background: ${CONFIG.colors.primary};
                    color: white;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    box-shadow: 0 2px 10px ${CONFIG.colors.shadow};
                    animation: notificationSlide 0.3s ease-out;
                    z-index: 10001;
                    max-width: 200px;
                    word-wrap: break-word;
                }

                @keyframes notificationSlide {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .technet-chatbot-window {
                        width: calc(100vw - 24px);
                        height: calc(100vh - 24px);
                        bottom: 12px;
                        right: 12px;
                        border-radius: 12px;
                    }
                    
                    .technet-chatbot-trigger {
                        bottom: 16px;
                        right: 16px;
                    }
                }

                /* Minimized state */
                .technet-chatbot-window.minimized {
                    height: 60px;
                    overflow: hidden;
                }

                .technet-chatbot-window.minimized .technet-chatbot-messages,
                .technet-chatbot-window.minimized .technet-chatbot-input {
                    display: none;
                }

                /* Accessibility */
                .technet-chatbot-trigger:focus,
                .technet-chatbot-control-btn:focus,
                .technet-send-btn:focus {
                    outline: 2px solid ${CONFIG.colors.secondary};
                    outline-offset: 2px;
                }
            `;

      const styleSheet = createElement("style");
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
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

      // Add to document
      document.body.appendChild(this.trigger);
      document.body.appendChild(this.window);

      // Store references
      this.inputField = this.window.querySelector(".technet-input-field");
      this.sendBtn = this.window.querySelector(".technet-send-btn");
      this.minimizeBtn = this.window.querySelector(".minimize-btn");
      this.closeBtn = this.window.querySelector(".close-btn");
    }

    bindEvents() {
      // Trigger button
      this.trigger.addEventListener("click", () => this.toggleChat());
      this.trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleChat();
        }
      });

      // Control buttons
      this.closeBtn.addEventListener("click", () => this.closeChat());
      this.minimizeBtn.addEventListener("click", () => this.toggleMinimize());

      // Input handling
      this.inputField.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Auto-resize textarea
      this.inputField.addEventListener("input", () => {
        this.inputField.style.height = "auto";
        this.inputField.style.height =
          Math.min(this.inputField.scrollHeight, 80) + "px";
      });

      this.sendBtn.addEventListener("click", () => this.sendMessage());

      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.closeChat();
        }
      });

      // Click outside to close (optional)
      document.addEventListener("click", (e) => {
        if (
          this.isOpen &&
          !this.window.contains(e.target) &&
          !this.trigger.contains(e.target)
        ) {
          // Uncomment the next line if you want click-outside-to-close behavior
          // this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.window.style.display = "flex";
      this.trigger.classList.add("open");
      this.trigger.setAttribute("aria-expanded", "true");

      // Focus the input field
      setTimeout(() => {
        this.inputField.focus();
      }, 300);

      this.scrollToBottom();
    }

    closeChat() {
      this.isOpen = false;
      this.isMinimized = false;
      this.window.style.display = "none";
      this.window.classList.remove("minimized");
      this.trigger.classList.remove("open");
      this.trigger.setAttribute("aria-expanded", "false");
    }

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
        this.scrollToBottom();
      }
    }

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

    addMessage(text, sender, sources = [], isInitial = false) {
      const message = {
        id: Date.now(),
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
        this.scrollToBottom();
      }
    }

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
        sourcesDiv.innerHTML = `
                    <div class="technet-sources-title">Sources:</div>
                    <ul class="technet-sources-list">
                        ${message.sources
                          .map(
                            (source) =>
                              `<li>• <a href="${sanitizeHTML(
                                source
                              )}" target="_blank" rel="noopener noreferrer">${sanitizeHTML(
                                source
                              )}</a></li>`
                          )
                          .join("")}
                    </ul>
                `;
        contentWrapper.appendChild(sourcesDiv);
      }

      messageDiv.appendChild(avatar);
      messageDiv.appendChild(contentWrapper);

      return messageDiv;
    }

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
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      if (this.typingIndicator) {
        this.typingIndicator.remove();
        this.typingIndicator = null;
      }
      this.isTyping = false;
      this.sendBtn.disabled = false;
    }

    scrollToBottom() {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 100);
    }

    showNotification(message) {
      const notification = createElement("div", "technet-notification");
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  }

  // Initialize when DOM is ready
  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        new TechNetChatbot();
      });
    } else {
      new TechNetChatbot();
    }
  }

  // Prevent multiple initialization
  if (!window.technetChatbotInitialized) {
    window.technetChatbotInitialized = true;
    init();
  }
})();
