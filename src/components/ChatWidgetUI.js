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

/**
 * Renders the widget UI within the shadow DOM
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function render(widget) {
  // Add styles to shadow DOM
  const style = createElement("style");
  style.textContent = getStyles();
  widget.shadow.appendChild(style);

  // Create widget container
  const container = createElement("div", "technet-chatbot");

  // Create trigger button
  widget.trigger = createElement("button", "technet-chatbot-trigger");
  widget.trigger.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  `;
  widget.trigger.setAttribute("aria-label", "Open TechNet Chat Assistant");
  widget.trigger.setAttribute("role", "button");
  widget.trigger.setAttribute("tabindex", "0");

  // Create chat window
  widget.window = createElement("div", "technet-chatbot-window");
  widget.window.setAttribute("role", "dialog");
  widget.window.setAttribute("aria-label", "TechNet Chat Assistant");

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
      
      <button class="technet-chatbot-control-btn close-btn" aria-label="Close chat">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  `;

  // Create messages container
  widget.messagesContainer = createElement("div", "technet-chatbot-messages");
  widget.messagesContainer.setAttribute("role", "log");
  widget.messagesContainer.setAttribute("aria-live", "polite");

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
  widget.window.appendChild(header);
  widget.window.appendChild(widget.messagesContainer);
  widget.window.appendChild(inputArea);

  // Add to container
  container.appendChild(widget.trigger);
  container.appendChild(widget.window);

  // Add container to shadow DOM
  widget.shadow.appendChild(container);

  // Store references to elements
  widget.inputField = widget.window.querySelector(".technet-input-field");
  widget.sendBtn = widget.window.querySelector(".technet-send-btn");
  widget.closeBtn = widget.window.querySelector(".close-btn");
}
