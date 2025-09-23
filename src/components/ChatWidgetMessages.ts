import { createElement, formatTime, scrollToBottom } from "../utils/dom";
import { sanitizeHTML, sanitizeURL } from "../utils/sanitizer";
import { generateId } from "../utils/helpers";
import { CONFIG } from "../config/config";
import ChatWidget from "./ChatWidget";
import { Message } from "../types/types";

/**
 * Adds a message to the chat
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {string} text - The message text
 * @param {string} sender - The sender ("user" or "bot")
 * @param {Array} sources - Array of source URLs
 * @param {boolean} isInitial - Whether this is the initial message
 */
export function addMessage(
  widget: ChatWidget,
  text: string,
  sender: "bot" | "user",
  sources: string[] = [],
  isInitial = false
) {
  const message: Message = {
    id: generateId(),
    text: sanitizeHTML(text),
    sender,
    sources: sources || [],
    timestamp: new Date(),
    isInitial,
  };

  widget.messageHistory.push(message);

  const messageElement = createMessageElement(message);
  widget.messagesContainer!.appendChild(messageElement);

  if (!isInitial) {
    scrollToBottom(widget.messagesContainer!);
  }

  return messageElement;
}

/**
 * Creates a message element
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {Object} message - The message object
 * @returns {HTMLElement} The message element
 */
export function createMessageElement(message: Message) {
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
        const link = createElement("a") as HTMLAnchorElement;
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
export function showTypingIndicator(widget: ChatWidget) {
  if (widget.typingIndicator) return;

  widget.isTyping = true;
  widget.sendBtn!.disabled = true;

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

  widget.messagesContainer!.appendChild(widget.typingIndicator);
  scrollToBottom(widget.messagesContainer!);
}

/**
 * Hides the typing indicator
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function hideTypingIndicator(widget: ChatWidget) {
  if (widget.typingIndicator) {
    widget.typingIndicator.remove();
    widget.typingIndicator = null as unknown as HTMLElement;
  }
  widget.isTyping = false;
  widget.sendBtn!.disabled = false;
}

/**
 * Shows a notification message
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {string} message - The notification message
 */
export function showNotification(widget: ChatWidget, message: string) {
  const notification = createElement("div", "technet-notification");
  notification.textContent = sanitizeHTML(message);
  widget.shadow.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

/**
 * Streams a bot message with typing indicator
 * @param {ChatWidget} widget - The ChatWidget instance
 * @param {string} userMessage - The user's message to send to the API
 */
export async function streamBotMessage(
  widget: ChatWidget,
  userMessage: string
) {
  // Show typing indicator
  showTypingIndicator(widget);

  try {
    const response = await fetch(
      `http://localhost:8000/chat/stream-summary?message=${encodeURIComponent(
        userMessage
      )}`
    );

    if (!response.body) {
      hideTypingIndicator(widget);
      throw new Error("Streaming not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Create empty message bubble for bot
    let botMessageEl = null;

    let accumulatedText = "";
    let sources: string[] = [];
    let done = false;
    let isFirstChunk = true;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        if (isFirstChunk) {
          botMessageEl = addMessage(widget, "", "bot");
          hideTypingIndicator(widget);
          isFirstChunk = false;
        }
        const chunk = decoder.decode(value, { stream: true });

        const sourcesMarker = "\n\n[SOURCES]: ";
        const sourcesIndex = chunk.indexOf(sourcesMarker);

        if (sourcesIndex !== -1) {
          // Extract the text before the sources marker
          accumulatedText += chunk.substring(0, sourcesIndex);

          // Extract and parse the sources JSON
          const sourcesJsonString = chunk.substring(
            sourcesIndex + sourcesMarker.length
          );
          try {
            sources = JSON.parse(sourcesJsonString);
          } catch (e) {
            console.error("Failed to parse sources JSON:", e);
          }
          done = true; // End of stream after sources
        } else {
          // Regular text chunk
          accumulatedText += chunk;
        }

        // Update the message content
        const messageContentEl = botMessageEl!.querySelector(
          ".technet-message-content"
        ) as HTMLElement;
        if (messageContentEl) {
          messageContentEl.textContent = accumulatedText;
          scrollToBottom(widget.messagesContainer!);
        }
      }
    }

    // If the stream finishes before any chunks were received, hide the indicator
    if (isFirstChunk) {
      hideTypingIndicator(widget);
    }

    // Update message history with final content and sources
    const messageId = botMessageEl!.getAttribute("data-message-id");
    if (messageId) {
      const message = widget.messageHistory.find((m) => m.id === messageId);
      if (message) {
        message.text = accumulatedText;
        message.sources = sources as any;

        // Append sources to the message element
        if (sources.length > 0) {
          appendSources(botMessageEl!, sources as any);
        }
      }
    }
  } catch (error) {
    hideTypingIndicator(widget);
    throw error;
  }
}

/**
 * Appends sources to a message element
 * @param {HTMLElement} messageElement - The message element
 * @param {Array} sources - Array of source objects
 */
function appendSources(messageElement: HTMLElement, sources: any[]) {
  const contentWrapper = messageElement.querySelector(
    ".technet-message-content"
  )!.parentElement;

  if (contentWrapper) {
    const sourcesDiv = createElement("div", "technet-message-sources");
    const sourcesList = createElement("ul", "technet-sources-list");

    sources.forEach((source) => {
      const sanitizedSource = sanitizeURL(source.source);
      if (sanitizedSource) {
        const listItem = createElement("li");
        const link = createElement("a") as HTMLAnchorElement;
        link.href = sanitizedSource;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = source.file_name || sanitizedSource;
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
}
