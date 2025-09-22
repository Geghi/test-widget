/**
 * Styles for TechNet Chatbot Widget
 * Contains all CSS styles as JavaScript template literals for Shadow DOM encapsulation
 */

import { CONFIG } from "../config/config.js";

/**
 * Generates the complete CSS styles for the widget
 * @returns {string} The CSS styles as a string
 */
export function getStyles() {
  return `
    :host {
      all: initial; /* Reset all inherited styles */
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .technet-chatbot * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .technet-chatbot-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, #3a7a7a 100%);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 20px ${CONFIG.colors.shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
      z-index: 10000;
      border: none;
      outline: none;
    }

    .technet-chatbot-trigger:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 25px ${CONFIG.colors.shadow};
    }

    .technet-chatbot-trigger:active {
      transform: scale(0.95);
    }

    .technet-chatbot-trigger svg {
      width: 28px;
      height: 28px;
      fill: white;
      transition: transform ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
    }

    .technet-chatbot-trigger.open svg {
      transform: rotate(180deg);
    }

    .technet-chatbot-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: ${CONFIG.dimensions.windowWidth}px;
      height: ${CONFIG.dimensions.windowHeight}px;
      background: ${CONFIG.colors.background};
      border-radius: 16px;
      box-shadow: 0 10px 40px ${CONFIG.colors.shadow};
      display: none;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideUp ${CONFIG.animation.duration}ms ${CONFIG.animation.easing};
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .technet-chatbot-header {
      background: linear-gradient(135deg, ${CONFIG.colors.primary} 0%, #3a7a7a 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .technet-chatbot-title {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .technet-chatbot-controls {
      display: flex;
      gap: 8px;
    }

    .technet-chatbot-control-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background ${CONFIG.animation.duration}ms ease;
    }

    .technet-chatbot-control-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .technet-chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
    }

    .technet-chatbot-messages::-webkit-scrollbar {
      width: 6px;
    }

    .technet-chatbot-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .technet-chatbot-messages::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .technet-message {
      display: flex;
      align-items: flex-start; /* Changed from flex-end to flex-start for better long message handling */
      gap: 8px;
      animation: messageSlideIn 0.3s ease-out;
      width: 100%; /* Ensure full width usage */
      box-sizing: border-box;
    }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .technet-message.user {
      flex-direction: row-reverse;
      justify-content: flex-start; /* Added for proper alignment */
    }

    .technet-message.bot {
      justify-content: flex-start; /* Added for proper alignment */
    }

    .technet-message > div:not(.technet-message-avatar) {
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 40px); /* Account for avatar width */
      min-width: 0; /* Allow shrinking */
    }

    .technet-message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      flex-shrink: 0;
    }

    .technet-message.bot .technet-message-avatar {
      background: ${CONFIG.colors.primary};
      color: white;
    }

    .technet-message.user .technet-message-avatar {
      background: ${CONFIG.colors.secondary};
      color: white;
    }

    .technet-message-content {
      max-width: 85%;
      padding: 12px 16px; /* Increased horizontal padding for better spacing */
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      word-break: break-word; /* Added for better long word handling */
      overflow-wrap: break-word; /* Added for better overflow handling */
      hyphens: auto; /* Added for better text wrapping */
      white-space: pre-wrap; /* Preserve line breaks but allow wrapping */
      display: block; /* Changed from inline-block to block for better layout */
      box-sizing: border-box; /* Ensure padding is included in width calculation */
    }


    .technet-message.bot .technet-message-content {
      background: ${CONFIG.colors.botMessage};
      color: ${CONFIG.colors.text};
      border-bottom-left-radius: 6px !important;
      margin-left: 0; /* Ensure proper alignment */
    }

    .technet-message.user .technet-message-content {
      background: ${CONFIG.colors.userMessage};
      color: ${CONFIG.colors.text};
      border-bottom-right-radius: 6px !important; /* Fixed typo: was "imporant" */
      margin-right: 0; /* Ensure proper alignment */
      margin-left: auto; /* Push to right side */
    }

    /* Fix for message time alignment */
    .technet-message-time {
      font-size: 11px;
      color: ${CONFIG.colors.textLight};
      margin-top: 4px;
      align-self: flex-end; /* Align time to the right for user messages */
    }

    .technet-message.bot .technet-message-time {
      align-self: flex-start; /* Align time to the left for bot messages */
    }
      
    .technet-message-sources {
      margin-top: 8px;
      padding: 8px 12px;
      background: rgba(44, 95, 95, 0.05);
      border-radius: 8px;
      border-left: 3px solid ${CONFIG.colors.primary};
      width: 100%;
      box-sizing: border-box;
      word-break: break-all; /* Break long URLs */
    }

    .technet-sources-title {
      font-size: 12px;
      font-weight: 600;
      color: ${CONFIG.colors.primary};
      margin-bottom: 4px;
    }

    .technet-sources-list {
      list-style: none;
      font-size: 11px;
    }

    .technet-sources-list li {
      margin-bottom: 2px;
    }

    .technet-sources-list a {
      color: ${CONFIG.colors.primary};
      text-decoration: none;
      word-break: break-all;
    }

    .technet-sources-list a:hover {
      text-decoration: underline;
    }

    .technet-typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      color: ${CONFIG.colors.textLight};
      font-size: 12px;
    }

    .technet-typing-dots {
      display: flex;
      gap: 2px;
    }

    .technet-typing-dot {
      width: 4px;
      height: 4px;
      background: ${CONFIG.colors.textLight};
      border-radius: 50%;
      animation: typingDot 1.4s infinite ease-in-out;
    }

    .technet-typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .technet-typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typingDot {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.5;
      }
      30% {
        transform: translateY(-8px);
        opacity: 1;
      }
    }

    .technet-chatbot-input {
      padding: 16px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .technet-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .technet-input-field {
      width: 100%;
      min-height: 20px;
      max-height: 80px;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 20px;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      outline: none;
      transition: border-color 0.2s ease;
      overflow-y: auto;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: pre-wrap; /* Allow proper line breaks in input */
      box-sizing: border-box;
    }

    .technet-input-field:focus {
      border-color: ${CONFIG.colors.primary};
    }

    .technet-input-field::placeholder {
      color: ${CONFIG.colors.textLight};
    }

    .technet-send-btn {
      width: 40px;
      height: 40px;
      background: ${CONFIG.colors.primary};
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .technet-send-btn:hover:not(:disabled) {
      background: #3a7a7a;
      transform: scale(1.05);
    }

    .technet-send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .technet-notification {
      position: fixed;
      bottom: 80px;
      right: 100px;
      background: ${CONFIG.colors.primary};
      color: white;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      box-shadow: 0 2px 10px ${CONFIG.colors.shadow};
      animation: notificationSlide 0.3s ease-out;
      z-index: 10001;
      max-width: 200px;
      word-wrap: break-word;
    }

    @keyframes notificationSlide {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Mobile Responsiveness */
    @media (max-width: ${CONFIG.dimensions.mobileBreakpoint}px) {
      .technet-chatbot-window {
        width: calc(100vw - 24px);
        height: calc(100vh - 114px);
        bottom: 95px;
        right: 12px;
        border-radius: 12px;
      }
      
      .technet-chatbot-trigger {
        bottom: 16px;
        right: 16px;
      }
    }

    /* Minimized state */
    .technet-chatbot-window.minimized {
      height: 60px;
      overflow: hidden;
    }

    .technet-chatbot-window.minimized .technet-chatbot-messages,
    .technet-chatbot-window.minimized .technet-chatbot-input {
      display: none;
    }

    /* Accessibility */
    .technet-chatbot-trigger:focus,
    .technet-chatbot-control-btn:focus,
    .technet-send-btn:focus {
      outline: 2px solid ${CONFIG.colors.secondary};
      outline-offset: 2px;
    }
  `;
}

export default {
  getStyles,
};
