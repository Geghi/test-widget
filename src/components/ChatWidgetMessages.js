import { createElement, formatTime, scrollToBottom } from "../utils/dom.js";
import { sanitizeHTML, sanitizeURL } from "../utils/sanitizer.js";
import { generateId } from "../utils/helpers.js";
import { CONFIG } from "../config/config.js";

/**
 * Adds a message to the chat
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {string} text - The message text
 * @param {string} sender - The sender ("user" or "bot")
 * @param {Array} sources - Array of source URLs
 * @param {boolean} isInitial - Whether this is the initial message
 */
export function addMessage(
  widget,
  text,
  sender,
  sources = [],
  isInitial = false
) {
  const message = {
    id: generateId(),
    text: sanitizeHTML(text),
    sender,
    sources: sources || [],
    timestamp: new Date(),
    isInitial,
  };

  widget.messageHistory.push(message);

  const messageElement = createMessageElement(widget, message);
  widget.messagesContainer.appendChild(messageElement);

  if (!isInitial) {
    scrollToBottom(widget.messagesContainer);
  }
}

/**
 * Creates a message element
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {Object} message - The message object
 * @returns {HTMLElement} The message element
 */
export function createMessageElement(widget, message) {
  const messageDiv = createElement("div", `technet-message ${message.sender}`);
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
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function showTypingIndicator(widget) {
  if (widget.typingIndicator) return;

  widget.isTyping = true;
  widget.sendBtn.disabled = true;

  widget.typingIndicator = createElement("div", "technet-message bot");
  widget.typingIndicator.innerHTML = `
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

  widget.messagesContainer.appendChild(widget.typingIndicator);
  scrollToBottom(widget.messagesContainer);
}

/**
 * Hides the typing indicator
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function hideTypingIndicator(widget) {
  if (widget.typingIndicator) {
    widget.typingIndicator.remove();
    widget.typingIndicator = null;
  }
  widget.isTyping = false;
  widget.sendBtn.disabled = false;
}

/**
 * Shows a notification message
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {string} message - The notification message
 */
export function showNotification(widget, message) {
  const notification = createElement("div", "technet-notification");
  notification.textContent = sanitizeHTML(message);
  widget.shadow.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}
