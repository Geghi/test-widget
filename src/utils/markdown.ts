import { marked, Renderer } from "marked";

const renderer = new Renderer();

// Override the code block rendering to handle 'md' language specifically
renderer.code = ({ text, lang }) => {
  if (lang === "md") {
    // If the language is 'md', parse the content as Markdown.
    return marked(text) as string;
  }
  // For all other languages, return the default code block HTML.
  return `<pre><code class="language-${lang || ""}">${text}</code></pre>`;
};

marked.use({ renderer, breaks: true });

export const parseMarkdown = (text: string): string => {
  return marked(text) as string;
};
