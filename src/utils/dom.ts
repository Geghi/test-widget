/**
 * DOM Utility Functions for TechNet Chatbot Widget
 * Provides helper functions for DOM manipulation and element creation
 */

/**
 * Creates an HTML element with optional class name and inner HTML
 * @param {string} tag - The HTML tag name
 * @param {string} [className] - Optional CSS class name
 * @param {string} [innerHTML] - Optional inner HTML content
 * @returns {HTMLElement} The created element
 */
export function createElement(
  tag: string,
  className: string = "",
  innerHTML: string = ""
) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

/**
 * Formats a date object into a time string (HH:MM)
 * @param {Date} date - The date object to format
 * @returns {string} Formatted time string
 */
export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Scrolls the messages container to the bottom
 * @param {HTMLElement} container - The messages container element
 */
export function scrollToBottom(container: HTMLElement) {
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 100);
}

/**
 * Auto-resizes a textarea element based on its content
 * @param {HTMLTextAreaElement} textarea - The textarea to resize
 * @param {number} maxHeight - Maximum height for the textarea
 */
export function autoResizeTextarea(
  textarea: HTMLTextAreaElement,
  maxHeight = 80
) {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
}

export default {
  createElement,
  formatTime,
  scrollToBottom,
  autoResizeTextarea,
};
