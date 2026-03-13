import { VoiceCommandResult } from "../types";

export async function parseVoiceCommand(transcript: string): Promise<VoiceCommandResult | null> {
  try {
    const response = await fetch("/api/parse-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to parse command");
    }

    const result = await response.json();
    return result as VoiceCommandResult;
  } catch (error) {
    console.error("Error parsing voice command:", error);
    return null;
  }
}
