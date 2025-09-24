import { createElement } from "./dom";

export function createSourceLink(sanitizedSource: string): HTMLAnchorElement {
  const link = createElement("a") as HTMLAnchorElement;
  link.href = sanitizedSource;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = sanitizedSource;
  return link;
}

export function createSourceListItem(sanitizedSource: string): HTMLElement {
  const listItem = createElement("li");
  const link = createSourceLink(sanitizedSource);
  listItem.appendChild(link);
  return listItem;
}
