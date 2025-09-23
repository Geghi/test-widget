/**
 * HTML Sanitization Utility for TechNet Chatbot Widget
 * Provides functions to sanitize user input and prevent XSS attacks
 */

/**
 * Sanitizes HTML by escaping special characters
 * @param {string} str - The string to sanitize
 * @returns {string} The sanitized string
 */
export function sanitizeHTML(str: string) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Sanitizes a URL by validating its protocol
 * @param {string} url - The URL to sanitize
 * @returns {string} The sanitized URL or an empty string if invalid
 */
export function sanitizeURL(url: string) {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return url;
    }
    return "";
  } catch (e) {
    // If URL parsing fails, return empty string
    return "";
  }
}

export default {
  sanitizeHTML,
  sanitizeURL,
};
