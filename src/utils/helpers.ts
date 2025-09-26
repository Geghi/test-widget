import { marked } from "marked";

/**
 * General Helper Functions for TechNet Chatbot Widget
 * Provides utility functions for debouncing and other general purposes
 */

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} The debounced function
 */
export function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a unique ID
 * @returns {string} A unique ID string
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Checks if the current device is mobile
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export function isMobile() {
  return window.innerWidth <= 768;
}

export function extractSources(sourcesJsonString: string): string[] {
  try {
    return JSON.parse(sourcesJsonString);
  } catch (e) {
    console.error("Failed to parse sources JSON:", e);
    return [];
  }
}

/**
 * Checks if text contains Markdown syntax
 * @param {string} text - The text to check
 * @returns {boolean} True if the text contains Markdown syntax
 */
export function hasMarkdown(text: string): boolean {
  // Check for comprehensive Markdown patterns
  return /\*\*.*\*\*|^\s*#{1,6}\s|\*.*\*|_[^_]*_|\`[^`]*\`|\[.*\]\(.*\)|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>\s|```[\s\S]*?```/.test(
    text
  );
}

/**
 * Parses Markdown text to HTML
 * @param {string} text - The Markdown text to parse
 * @returns {string} The parsed HTML
 */
export function parseMarkdown(text: string): string {
  return marked(text) as string;
}
