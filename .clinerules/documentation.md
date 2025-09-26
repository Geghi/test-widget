# TechNet Chat Widget Documentation

## 1. Project Overview

### Project Name

TechNet Chat Widget

### Description

The TechNet Chat Widget is a customizable and easily integratable chatbot interface designed to provide users with information and assistance. It leverages a modular component-based architecture, TypeScript for type safety, and Webpack for efficient bundling. The widget operates within a Shadow DOM to ensure style encapsulation and prevent conflicts with the host application.

### Purpose and Main Objectives

The primary purpose of this project is to offer a plug-and-play chat solution that can be embedded into any web application. Its main objectives include:

- Providing a seamless user experience for interacting with an AI assistant.
- Offering extensive customization options for appearance and behavior.
- Ensuring robust and secure communication with a backend API.
- Maintaining a lightweight and performable footprint.

### Key Features and Functionality

- **Customizable UI:** Configurable colors, dimensions, and messages.
- **Shadow DOM Encapsulation:** Prevents style conflicts with the host page.
- **Markdown Support:** Renders bot messages with rich text formatting.
- **Typing Indicator:** Provides visual feedback when the bot is generating a response.
- **Source Attribution:** Displays sources for bot responses.
- **Responsive Design:** Adapts to different screen sizes, including mobile.
- **API Integration:** Communicates with a configurable backend API for chat responses.

### Target Audience or Users

This documentation is intended for developers, project managers, and clients who need to understand, integrate, configure, and maintain the TechNet Chat Widget.

## 2. Technical Architecture

### System Architecture Explanation

The TechNet Chat Widget is implemented as a Web Component, allowing it to be easily embedded into any web page using a simple HTML tag (`<technet-chatbot>`). It utilizes a Shadow DOM for UI rendering and style encapsulation, ensuring that its styles do not interfere with the host application's styles.

The architecture is modular, consisting of several key components and utility modules:

- **Main Component (`ChatWidget.ts`):** The core class that extends `HTMLElement` and manages the lifecycle of the widget, including Shadow DOM creation, UI rendering, event binding, and state management.
- **UI Components (`ChatWidgetUI.ts`, `styles.ts`):** Responsible for rendering the visual elements of the chat interface and defining its appearance. `styles.ts` generates dynamic CSS based on configuration.
- **Interaction Components (`ChatWidgetEvents.ts`, `ChatWidgetMessages.ts`):** Handle user input, display messages, manage the typing indicator, and interact with the backend API for streaming responses.
- **Utility Modules (`dom.ts`, `elements.ts`, `helpers.ts`, `markdown.ts`, `sanitizer.ts`):** Provide helper functions for DOM manipulation, element creation, data formatting, markdown parsing, and security (HTML/URL sanitization).

### Modules/Components Description

- **`src/components/ChatWidget.ts`**: The central component. It initializes the Shadow DOM, renders the UI using `ChatWidgetUI`, binds events using `ChatWidgetEvents`, and manages the overall chat state, including message history and API communication.
- **`src/components/ChatWidgetEvents.ts`**: Manages all user interactions. It binds event listeners to the trigger button, close button, input field, and send button, handling actions like opening/closing the chat, sending messages, and auto-resizing the input field.
- **`src/components/ChatWidgetMessages.ts`**: Handles the display and management of chat messages. It includes functions to add new messages (user and bot), create message elements, show/hide the typing indicator, and display temporary notifications. It also manages the streaming of bot responses.
- **`src/components/ChatWidgetUI.ts`**: Responsible for the visual rendering of the chat widget. It constructs the HTML structure for the trigger button, chat window, header, message container, and input area within the Shadow DOM.
- **`src/components/styles.ts`**: Generates the dynamic CSS for the entire widget. It uses JavaScript template literals to create a style string that is injected into the Shadow DOM, ensuring all styles are scoped to the widget.
- **`src/config/config.ts`**: Defines the default and customizable configuration options for the widget, including colors, animations, messages, dimensions, and the API endpoint.
- **`src/types/chat-widget-config.ts`**: TypeScript interface definitions for the configuration objects, ensuring type safety for widget settings.
- **`src/utils/dom.ts`**: Provides utility functions for common DOM operations, such as creating elements, formatting time, scrolling to the bottom of a container, and auto-resizing text areas.
- **`src/utils/elements.ts`**: Contains helper functions specifically for creating and structuring HTML elements related to message sources (e.g., links and list items).
- **`src/utils/helpers.ts`**: Offers general utility functions like `debounce` for optimizing event handling, `generateId` for unique identifiers, `isMobile` for responsiveness checks, `extractSources` for parsing API responses, and `hasMarkdown`/`parseMarkdown` for markdown detection and rendering.
- **`src/utils/markdown.ts`**: Integrates the `marked` library to parse Markdown text into HTML, with a custom renderer to handle specific markdown code blocks.
- **`src/utils/sanitizer.ts`**: Provides security functions to prevent XSS attacks by sanitizing HTML content and validating URLs.

### Data Flow and Key Processes

1.  **Initialization:** When the host page loads, `src/index.ts` defines the `<technet-chatbot>` custom element. Upon `DOMContentLoaded`, an instance of `ChatWidget` is created and appended to the `document.body`.
2.  **UI Rendering:** The `ChatWidget` creates a Shadow DOM and calls `ChatWidgetUI.render()` to build the widget's HTML structure and inject styles from `styles.ts`.
3.  **Event Binding:** `ChatWidgetEvents.bindEvents()` attaches event listeners to UI elements (e.g., click on trigger, input in textarea, send button click).
4.  **User Message:** When a user types a message and presses Enter or clicks send:
    - `ChatWidget.sendMessage()` is called.
    - The message is sanitized using `sanitizer.ts`.
    - `ChatWidgetMessages.addMessage()` adds the user's message to the `messagesContainer` and updates `messageHistory`.
    - `ChatWidgetMessages.showTypingIndicator()` displays a "Thinking..." animation.
    - `ChatWidgetMessages.streamBotMessage()` initiates a fetch request to the configured `apiUrl` with the user's message.
5.  **Bot Response Streaming:**
    - The API response is streamed chunk by chunk.
    - `ChatWidgetMessages.streamBotMessage()` continuously decodes and appends text to the bot's message bubble.
    - Markdown content is parsed to HTML using `markdown.ts` and `helpers.ts`.
    - If sources are included in the stream, they are extracted and appended to the message.
    - `ChatWidgetMessages.hideTypingIndicator()` is called once the stream completes.
6.  **Chat State Management:** `ChatWidget` maintains `isOpen` and `isTyping` flags, and `messageHistory` to keep track of the conversation.

## 3. Installation & Setup

### Prerequisites

- **Node.js:** (Recommended: Version 18 or higher.)
- **pnpm:** Package manager.
- **Web Browser:** A modern web browser supporting Web Components and Shadow DOM (e.g., Chrome, Firefox, Edge, Safari).

### Step-by-step Setup and Installation Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<technet-repository>/technet-widget.git
    cd technet-widget
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Build the project:**

    ```bash
    pnpm run build
    ```

    This will compile the TypeScript code and bundle it into `dist/bundle.js`.

4.  **open the `index.html` file:**
    You can use a simple static file server for local development. For example, using `http-server`:
    ```bash
    start ./index.html
    ```
    This will open an html page with the widget included for testing.

### Configuration Files and Environment Variables

- **`src/config/config.ts`**: This file contains the primary configuration object (`CONFIG`) for the chat widget. You can modify properties like `position`, `colors`, `animation`, `messages`, `dimensions`, and `apiUrl` directly in this file or override them at runtime if the widget exposes such an API.
- **`.env`**: The `apiUrl` property in `src/config/config.ts` is populated from `process.env.API_URL`. For local development, create a `.env` file in the project root:
  ```
  API_URL=http://127.0.0.1:8000/api/stream-summary
  ```
  Replace `http://localhost:8000/` with your actual backend API endpoint when running in production. Webpack is configured to load these environment variables.

## 4. Usage Guide

### How to run and interact with the project

After following the installation and setup steps:

1.  Ensure the project is built (`pnpm run build`).
2.  Open `index.html` in your web browser.
3.  The chat widget trigger button will appear at the configured position (default: bottom-right).
4.  Click the trigger button to open the chat window.
5.  Type your message in the input field and press Enter or click the send button.
6.  The bot's response will stream into the chat window.

### Input/output explanations

- **Input:** Users type text into the input field. This text is sent to the configured `apiUrl`.
- **Output:** The bot's responses are streamed back from the `apiUrl`. These responses can contain plain text or Markdown. If Markdown is detected, it will be rendered as rich HTML. Responses may also include source URLs, which are displayed as clickable links.

## 5. Code Explanation

### Key modules, classes, and functions

- **`ChatWidget` class (src/components/ChatWidget.ts):**

  - `constructor()`: Initializes the Shadow DOM, attaches it to the custom element, and sets up initial state.
  - `connectedCallback()`: Lifecycle method called when the element is added to the DOM. It renders the UI, binds events, and displays the initial message.
  - `toggleChat()`: Toggles the visibility of the chat window.
  - `openChat()`: Opens the chat window and sets focus to the input field.
  - `closeChat()`: Closes the chat window.
  - `sendMessage()`: Handles sending user messages, calling `ChatWidgetMessages.addMessage` and `ChatWidgetMessages.streamBotMessage`.
  - `handleKeyDown(e: KeyboardEvent)`: Handles keyboard events for accessibility, specifically for the trigger button.

- **`addMessage` function (src/components/ChatWidgetMessages.ts):**

  - Adds a new message (user or bot) to the chat interface, creates its DOM element, and scrolls the view to the bottom. Handles message sanitization and source attachment.

- **`streamBotMessage` function (src/components/ChatWidgetMessages.ts):**

  - Manages the asynchronous streaming of bot responses from the API. It shows a typing indicator, processes incoming text chunks, parses Markdown, extracts sources, and updates the message in real-time.

- **`getStyles` function (src/components/styles.ts):**

  - Dynamically generates the CSS string for the entire widget based on the `CONFIG` object, ensuring consistent styling and easy customization.

## 6. Testing

### Testing strategy and framework

This project does not currently include a dedicated testing framework or suite. Testing is primarily manual, involving:

- **Visual Inspection:** Verifying the UI renders correctly across different browsers and screen sizes.
- **Functional Testing:** Interacting with the chat widget to ensure all features (sending messages, receiving responses, opening/closing, notifications, sources) work as expected.
- **Configuration Testing:** Modifying `src/config/config.ts` and `.env` variables to ensure customizations are applied correctly.

### How to run tests and interpret results

Currently, manual testing involves:

1.  Building the project (`pnpm run build`).
2.  open `index.html` page in a browser.
3.  Interacting with the widget and observing its behavior.
4.  Checking the browser's console for any errors.

For future development, integrating a unit testing framework (e.g., Jest, Vitest) and an end-to-end testing framework (e.g., Playwright, Cypress) would be highly recommended.

## 7. Maintenance & Contribution

### Guidelines for future developers to maintain or extend the project

- **Modularity:** When adding new features, strive to maintain the modular structure. Create new components or utility functions as needed, rather than adding excessive logic to existing files.
- **Shadow DOM:** Remember that the widget operates within a Shadow DOM. Any new UI elements or styles must be added within this context to ensure proper encapsulation.
- **Configuration:** Utilize `src/config/config.ts` for any new customizable settings. Extend `src/types/chat-widget-config.ts` for type safety.
- **Security:** Always sanitize user-generated content and validate external URLs to prevent security vulnerabilities.
- **Accessibility:** Ensure all new UI elements are accessible, including proper ARIA attributes, keyboard navigation, and focus management.
