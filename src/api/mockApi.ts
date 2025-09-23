/**
 * Mock API for TechNet Chatbot Widget
 * Simulates API calls for demonstration purposes
 */

/**
 * Mock API function that simulates network requests
 * @param {string} message - The user's message
 * @returns {Promise<Object>} A promise that resolves with a mock response
 */
export async function mockAPI(
  message: string
): Promise<{ text: string; sources: string[] }> {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error("Network error");
  }

  // Mock responses with sources
  const responses = [
    {
      text: "Based on current WHO guidelines, routine immunization schedules should be maintained even during health emergencies. It's crucial to ensure continued protection against vaccine-preventable diseases.",
      sources: [
        "https://www.who.int/immunization/policy/position_papers/en/",
        "https://www.cdc.gov/vaccines/schedules/index.html",
      ],
    },
    {
      text: "The global immunization coverage has shown improvement over recent years, with over 85% of children worldwide receiving basic vaccines. However, equity gaps remain in underserved populations.",
      sources: [
        "https://www.who.int/news-room/fact-sheets/detail/immunization-coverage",
        "https://data.unicef.org/topic/child-health/immunization/",
      ],
    },
    {
      text: "Cold chain management is critical for vaccine effectiveness. Vaccines should be stored between 2-8°C and monitored continuously to ensure potency.",
      sources: [
        "https://www.who.int/immunization/programmes_systems/supply_chain/resources/en/",
        "https://www.cdc.gov/vaccines/hcp/admin/storage/guide.html",
      ],
    },
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
