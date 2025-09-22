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
export function debounce(func, wait) {
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

export default {
  debounce,
  generateId,
  isMobile,
};
