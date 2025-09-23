import { autoResizeTextarea } from "../utils/dom";
import { debounce, isMobile } from "../utils/helpers";
import ChatWidget from "./ChatWidget";

/**
 * Binds event listeners to widget elements
 * @param {ChatWidget} widget - The ChatWidget instance
 */
export function bindEvents(widget: ChatWidget) {
  // Trigger button
  widget.trigger!.addEventListener("click", () => widget.toggleChat());
  widget.trigger!.addEventListener("keydown", (e) => widget.handleKeyDown(e));

  // Control buttons
  widget.closeBtn!.addEventListener("click", () => widget.closeChat());

  // Input handling
  widget.inputField!.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      widget.sendMessage();
    }
  });

  // Auto-resize textarea
  widget.inputField!.addEventListener("input", () => {
    autoResizeTextarea(widget.inputField!);
  });

  widget.sendBtn!.addEventListener("click", () => widget.sendMessage());

  // Close on escape key
  widget.shadow.addEventListener("keydown", (e: Event) => {
    const keyboardEvent = e as KeyboardEvent;
    if (keyboardEvent.key === "Escape" && widget.isOpen) {
      widget.closeChat();
    }
  });

  // Handle window resize for mobile responsiveness
  window.addEventListener(
    "resize",
    debounce(() => {
      if (widget.isOpen && isMobile()) {
      }
    }, 250) as EventListener
  );
}
