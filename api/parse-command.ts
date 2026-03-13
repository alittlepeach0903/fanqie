import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;
  
  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API Key not configured on server" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following voice command for a Pomodoro timer: "${transcript}". 
      Extract the duration in minutes and the task name. 
      If the duration is not specified, default to 25 minutes. 
      If the task name is not specified, default to "Focus Session".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            durationMinutes: { type: Type.NUMBER },
            taskName: { type: Type.STRING }
          },
          required: ["durationMinutes", "taskName"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error parsing voice command:", error);
    return res.status(500).json({ error: "Failed to parse command" });
  }
}
