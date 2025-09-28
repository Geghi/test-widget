import { createElement, formatTime, scrollToBottom } from "../utils/dom";
import { sanitizeHTML, sanitizeURL } from "../utils/sanitizer";
import { extractSources, generateId } from "../utils/helpers";
import { parseMarkdown } from "../utils/markdown";
import { CONFIG } from "../config/config";
import ChatWidget from "./ChatWidget";
import { Message } from "../types/types";
import { createSourceListItem } from "../utils/elements";
import {
  postStreamConversationMessage,
  postStreamMessage,
} from "../api/chatApi";

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
  isInitial = false
) {
  const message: Message = {
    id: generateId(),
    text: sender === "user" ? sanitizeHTML(text) : text,
    sender,
    sources: [],
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
  avatar.innerHTML =
    message.sender === "bot"
      ? `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 775" preserveAspectRatio="xMidYMid meet" width="16" height="16">
        <path d="M0 0 C89.79 -2.556 179.256 30.729 253.874 96.071 C255.498 97.508 257.123 98.946 258.749 100.383 C267.314 108.099 275.439 116.258 282.874 125.071 C283.657 125.965 284.441 126.86 285.249 127.782 C332.808 182.392 361.85 251.504 370.874 323.071 C370.992 324.009 371.111 324.948 371.233 325.915 C374.875 356.479 379.993 408.831 365.874 437.071 C333.534 437.071 301.194 437.071 267.874 437.071 C269.874 426.071 269.874 426.071 270.874 420.817 C271.039 419.941 271.204 419.065 271.374 418.163 C271.702 416.419 272.035 414.677 272.374 412.936 C275.219 397.676 276.256 382.51 276.186 367.008 C276.184 366.163 276.182 365.317 276.181 364.445 C275.913 290.289 244.33 223.451 192.874 171.071 C190.3 168.605 187.634 166.323 184.874 164.071 C184.043 163.353 183.213 162.635 182.358 161.895 C166.035 147.914 148.121 135.695 128.874 126.071 C128.608 126.643 128.342 127.215 128.069 127.805 C126.817 130.178 125.38 132.193 123.749 134.321 C123.21 135.027 122.671 135.734 122.116 136.461 C121.501 137.258 121.501 137.258 120.874 138.071 C121.384 138.584 121.894 139.097 122.42 139.625 C152.142 170.928 164.014 212.539 163.014 254.897 C161.647 285.761 149.782 318.358 129.874 342.071 C128.927 343.231 127.98 344.391 127.034 345.551 C104.859 372.392 75.483 389.593 41.874 398.071 C39.969 398.554 39.969 398.554 38.026 399.047 C-2.64 408.038 -45.656 397.848 -80.334 375.985 C-87.107 371.571 -93.207 366.564 -99.126 361.071 C-99.981 360.282 -99.981 360.282 -100.853 359.478 C-132.064 330.333 -148.579 291.264 -150.255 248.805 C-150.993 206.505 -135.049 169.936 -108.126 138.071 C-109.061 136.798 -109.999 135.527 -110.939 134.258 C-111.461 133.551 -111.983 132.843 -112.521 132.114 C-113.958 130.285 -115.445 128.672 -117.126 127.071 C-133.618 135.341 -148.775 145.497 -163.126 157.071 C-164.111 157.851 -165.096 158.631 -166.111 159.434 C-180.347 171.051 -194.148 184.303 -205.126 199.071 C-205.999 200.214 -206.871 201.357 -207.744 202.5 C-214.43 211.353 -220.488 220.52 -226.126 230.071 C-226.57 230.819 -227.013 231.568 -227.47 232.339 C-262.566 292.199 -271.397 363.688 -255.538 430.858 C-255.126 433.071 -255.126 433.071 -255.126 437.071 C-287.466 437.071 -319.806 437.071 -353.126 437.071 C-354.998 427.715 -356.724 418.69 -357.751 409.258 C-357.876 408.134 -358.001 407.011 -358.13 405.853 C-359.127 396.597 -359.89 387.378 -360.126 378.071 C-360.148 377.236 -360.17 376.402 -360.193 375.542 C-362.053 290.861 -334.979 204.967 -281.126 139.071 C-280.397 138.152 -279.667 137.233 -278.916 136.286 C-273.724 129.81 -268.198 123.681 -262.547 117.609 C-261.105 116.048 -259.682 114.472 -258.263 112.891 C-253.836 107.969 -249.406 103.209 -244.318 98.954 C-242.077 97.028 -239.942 95.009 -237.802 92.973 C-229.736 85.338 -221.058 78.657 -212.126 72.071 C-211.527 71.625 -210.928 71.179 -210.311 70.72 C-149.026 25.241 -75.816 2.524 0 0 Z " fill="#FFFFFF" transform="translate(383.12646484375,20.92919921875)"/>
        <path d="M0 0 C1.857 1.598 3.689 3.225 5.5 4.875 C6.32 5.621 6.32 5.621 7.156 6.382 C30.201 27.633 44.998 56.657 46.621 88.23 C47.85 120.274 38.841 150.67 17.691 175.133 C15.239 177.576 15.239 177.576 15.625 180.062 C15.914 180.661 16.202 181.259 16.5 181.875 C16.83 182.865 17.16 183.855 17.5 184.875 C47.222 172.459 74.954 158.044 99.5 136.875 C100.233 136.252 100.967 135.63 101.723 134.988 C115.003 123.394 127.838 110.85 138.245 96.587 C139.572 94.777 140.928 92.992 142.289 91.207 C154.381 75.228 163.553 57.769 172.5 39.875 C206.49 39.875 240.48 39.875 275.5 39.875 C266.242 67.65 266.242 67.65 262.125 76.625 C261.662 77.654 261.198 78.683 260.72 79.743 C259.333 82.797 257.923 85.838 256.5 88.875 C255.869 90.221 255.869 90.221 255.226 91.594 C232.722 139.113 197.87 183.313 156.5 215.875 C155.209 216.919 153.919 217.963 152.629 219.008 C135.458 232.779 117.006 244.686 97.5 254.875 C96.51 255.394 96.51 255.394 95.5 255.923 C90.875 258.329 86.205 260.629 81.5 262.875 C80.761 263.229 80.022 263.583 79.261 263.948 C47.637 278.981 14.067 288.531 -20.5 293.875 C-21.504 294.039 -22.507 294.202 -23.541 294.371 C-57.593 299.726 -95.534 299.596 -129.5 293.875 C-131.348 293.569 -131.348 293.569 -133.233 293.257 C-191.634 283.32 -247.204 260.804 -294.5 224.875 C-295.122 224.405 -295.743 223.935 -296.384 223.451 C-300.485 220.334 -304.511 217.134 -308.5 213.875 C-309.046 213.434 -309.591 212.993 -310.153 212.538 C-319.417 204.989 -327.912 196.671 -336.375 188.25 C-336.909 187.721 -337.443 187.192 -337.994 186.647 C-344.97 179.724 -351.376 172.577 -357.5 164.875 C-359.06 163.06 -360.621 161.247 -362.188 159.438 C-375.43 143.498 -386.181 125.795 -396.5 107.875 C-396.942 107.112 -397.384 106.348 -397.839 105.562 C-424.5 58.987 -424.5 58.987 -424.5 39.875 C-390.84 39.875 -357.18 39.875 -322.5 39.875 C-319.2 46.145 -315.9 52.415 -312.5 58.875 C-306.218 70.542 -299.392 81.256 -291.5 91.875 C-291.044 92.491 -290.587 93.107 -290.117 93.742 C-282.9 103.407 -274.874 112.207 -266.5 120.875 C-265.749 121.659 -265.749 121.659 -264.983 122.458 C-258.555 129.15 -251.806 135.162 -244.5 140.875 C-243.492 141.677 -242.484 142.479 -241.445 143.305 C-224.709 156.512 -206.678 167.046 -187.5 176.312 C-186.652 176.726 -185.805 177.139 -184.931 177.564 C-179.254 180.255 -173.563 182.237 -167.5 183.875 C-166.015 181.4 -166.015 181.4 -164.5 178.875 C-165.201 178.027 -165.902 177.179 -166.625 176.305 C-188.799 149.07 -199.002 117.541 -195.793 82.476 C-192.19 50.546 -176.189 21.128 -151 1.031 C-107.352 -32.64 -43.942 -34.641 0 0 Z " fill="#FFFFFF" transform="translate(464.5,456.125)"/>
        </svg>
        `
      : `
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
      </svg>
    `;

  const contentWrapper = createElement("div");
  const content = createElement("div", "technet-message-content");
  if (message.sender === "bot") {
    content.innerHTML = parseMarkdown(message.text);
  } else {
    content.textContent = message.text;
  }

  const time = createElement("div", "technet-message-time");
  time.textContent = formatTime(message.timestamp);

  contentWrapper.appendChild(content);
  contentWrapper.appendChild(time);

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
 * Streams a bot message with typing indicator
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export async function streamBotMessage(widget: ChatWidget): Promise<void> {
  // Show typing indicator
  showTypingIndicator(widget);

  // Get the last X messages from history
  const historyLength = Math.min(
    CONFIG.conversationHistoryLength,
    widget.messageHistory.length
  );
  const recentMessages = widget.messageHistory.slice(-historyLength);

  // Format conversation as string
  const conversation = recentMessages
    .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.text}`)
    .join("\n");

  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  try {
    const response = await postStreamConversationMessage(conversation);

    if (!response.body) {
      throw new Error("Response body is null");
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Create empty message bubble for bot
    let botMessageEl: HTMLElement | null = null;

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
          // Extract sources JSON
          const sourcesJsonString = chunk.substring(
            sourcesIndex + sourcesMarker.length
          );
          sources = extractSources(sourcesJsonString);
          done = true; // End of stream after sources
        } else {
          // Regular text chunk
          accumulatedText += chunk;
        }

        updateMessageContent(
          botMessageEl!,
          accumulatedText,
          widget.messagesContainer!
        );
      }
    }

    // If the stream finishes before any chunks were received, hide the indicator
    if (isFirstChunk) {
      hideTypingIndicator(widget);
    }

    // Update message history with final content and sources
    if (botMessageEl) {
      updateMessageHistory(botMessageEl, accumulatedText, sources, widget);
    }
  } catch (error) {
    hideTypingIndicator(widget);

    // Log error for debugging
    console.error("Error in streamBotMessage:", error);

    // Re-throw with more context
    throw new Error(
      `Failed to stream bot message: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    // Ensure reader is always closed
    if (reader) {
      try {
        await reader.cancel();
        reader.releaseLock();
      } catch (cleanupError) {
        console.warn("Error cleaning up stream reader:", cleanupError);
      }
    }
  }
}

/**
 * Updates message content with throttling
 * @param {HTMLElement} messageElement - The message element to update
 * @param {string} text - The text content to display
 */
function updateMessageContent(
  messageElement: HTMLElement,
  text: string,
  messageContainer: HTMLElement
): void {
  const messageContentEl = messageElement.querySelector(
    ".technet-message-content"
  ) as HTMLElement;

  if (messageContentEl) {
    messageContentEl.innerHTML = parseMarkdown(text);
    scrollToBottom(messageContainer);
  }
}

/**
 * Updates message history with final content and sources
 * @param {HTMLElement} messageElement - The message element
 * @param {string} text - The final text content
 * @param {string[]} sources - Array of sources
 */
function updateMessageHistory(
  messageElement: HTMLElement,
  text: string,
  sources: string[],
  widget: ChatWidget
): void {
  const messageId = messageElement.getAttribute("data-message-id");
  if (!messageId) return;

  const message = widget.messageHistory.find((m) => m.id === messageId);
  if (!message) return;

  message.text = text;
  message.sources = sources;

  // Append sources to the message element
  if (sources.length > 0) {
    appendSources(messageElement, sources);
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
        const listItem = createSourceListItem(sanitizedSource);
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
