import { CONFIG } from "../config/config";

export async function postStreamMessage(message: string) {
  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  });

  if (!response.body) {
    throw new Error("Streaming not supported");
  }
  return response;
}

export async function postStreamConversationMessage(conversation: string) {
  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: conversation }),
  });

  if (!response.body) {
    throw new Error("Streaming not supported");
  }
  return response;
}
