import { CONFIG } from "../config/config";

export async function postStreamMessage(userMessage: string) {
  const response = await fetch(CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.body) {
    throw new Error("Streaming not supported");
  }
  return response;
}
