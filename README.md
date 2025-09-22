# TechNet Chatbot Widget

A modern, accessible chatbot widget for TechNet with Shadow DOM encapsulation.

## Features

- Shadow DOM encapsulation for complete style isolation
- Responsive design that works on mobile and desktop
- Accessible with proper ARIA attributes
- Customizable configuration
- Modular architecture for easy maintenance
- Production-ready build

## File Structure

```
src/
├── index.js (entry point)
├── components/
│   ├── ChatWidget.js (main widget class)
│   └── styles.js (CSS-in-JS styles)
├── config/
│   └── config.js (configuration object)
├── utils/
│   ├── dom.js (DOM utility functions)
│   ├── helpers.js (general helper functions)
│   └── sanitizer.js (HTML sanitization)
├── api/
│   └── mockApi.js (mock API implementation)
```

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This will create a production-ready bundle in the `dist/` directory.

## Development

```bash
npm run dev
```

This will start webpack in watch mode for development.

## Testing

To test the widget, you need to serve the files through a web server due to browser security restrictions:

```bash
npx http-server .
```

Then open `http://127.0.0.1:8080/test.html` in your browser.

Alternatively, you can use any other local web server solution like:

- Python's built-in server: `python -m http.server 8000`
- VS Code Live Server extension

## Usage

Include the built JavaScript file in your HTML:

```html
<script src="dist/technet-chatbot.min.js"></script>
```

The widget will automatically initialize and attach to the document body.

## Customization

To customize the widget, modify the configuration in `src/config/config.js` and rebuild the project.

## Browser Support

- Modern browsers with Shadow DOM support (Chrome, Firefox, Safari, Edge)

## Accessibility

The widget includes:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Security

- HTML sanitization for user input
- URL validation for source links
- Content Security Policy compliant
