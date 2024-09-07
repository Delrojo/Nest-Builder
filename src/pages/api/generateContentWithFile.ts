import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const GENERATION_CONFIG = {
  temperature: 1,
  top_p: 0.95,
  top_k: 0,
};

const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

const GEMINI_MODEL_URL =
  "https://api.generativeai.com/models/gemini-1.5-flash/generate";

// Helper function to extract JSON from the response
const extractJsonFromOutput = (output: string): any | null => {
  const pattern = /```json\n([\s\S]*?)\n```/;
  const match = output.match(pattern);

  if (match) {
    let jsonString = match[1];
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw error;
    }
  } else {
    console.error("No JSON found in output");
    return null;
  }
};

// Function to call the Gemini model and process the response
const generateContentWithFile = async (
  fileContent: string,
  systemInstruction: string
) => {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (!API_KEY) {
    throw new Error("API key is missing");
  }

  let response: any = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await axios.post(
        GEMINI_MODEL_URL,
        {
          system_instruction: systemInstruction,
          content: ["Follow the system instructions", fileContent],
          generation_config: GENERATION_CONFIG,
          safety_settings: SAFETY_SETTINGS,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const newText = extractJsonFromOutput(response.data);
      return newText;
    } catch (error: any) {
      if (error.response?.status === 503 || error.response?.status === 429) {
        console.log("Resource exhausted or service unavailable. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
      } else if (error.message.includes("JSON")) {
        console.log("JSON parse error. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        console.error("Error generating content:", error);
        throw error;
      }
    }
  }

  console.error("Failed after multiple attempts");
  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileContent, systemInstruction } = req.body;

  if (!fileContent || !systemInstruction) {
    return res
      .status(400)
      .json({ error: "File content and system instruction are required" });
  }

  try {
    const result = await generateContentWithFile(
      fileContent,
      systemInstruction
    );
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to generate content after retries" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
