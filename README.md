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
├── index.ts (entry point)
├── components/
│   ├── ChatWidget.ts (main widget class)
│   └── styles.ts (CSS-in-JS styles)
├── config/
│   └── config.ts (configuration object)
├── utils/
│   ├── dom.ts (DOM utility functions)
│   ├── helpers.ts (general helper functions)
│   └── sanitizer.ts (HTML sanitization)
├── api/
│   └── mockApi.ts (mock API implementation)
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

## Development / Testing

```bash
start .\index.html
```

This will open a test html file with the widget included for developement.

## Usage

Include the built JavaScript file in your HTML:

```html
<script defer src="dist/technet-chatbot.min.ts"></script>
```

The widget will automatically initialize and attach to the document body.

## Customization

To customize the widget, modify the configuration in `src/config/config.ts` and rebuild the project.

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
