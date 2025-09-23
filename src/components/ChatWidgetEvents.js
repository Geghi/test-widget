import { autoResizeTextarea, scrollToBottom } from "../utils/dom.js";
import { debounce, isMobile } from "../utils/helpers.js";
import { mockAPI } from "../api/mockApi.js";

/**
 * Binds event listeners to widget elements
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function bindEvents(widget) {
  // Trigger button
  widget.trigger.addEventListener("click", () => widget.toggleChat());
  widget.trigger.addEventListener("keydown", (e) => widget.handleKeyDown(e));

  // Control buttons
  widget.closeBtn.addEventListener("click", () => widget.closeChat());

  // Input handling
  widget.inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      widget.sendMessage();
    }
  });

  // Auto-resize textarea
  widget.inputField.addEventListener("input", () => {
    autoResizeTextarea(widget.inputField);
  });

  widget.sendBtn.addEventListener("click", () => widget.sendMessage());

  // Close on escape key
  widget.shadow.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.isOpen) {
      widget.closeChat();
    }
  });

  // Handle window resize for mobile responsiveness
  window.addEventListener(
    "resize",
    debounce(() => {
      if (widget.isOpen && isMobile()) {
      }
    }, 250)
  );
}
