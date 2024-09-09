import { NextApiRequest, NextApiResponse } from "next";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import {
  baseInstruction,
  taskInstructions,
} from "@/utils/functions/uploadFunctions";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("API key is missing.");
}

// Set up file manager and AI client
const genAI = new GoogleGenerativeAI(API_KEY);

function extractJsonFromOutput(output: string): any {
  const replacedOutput = output.replace("```json", "").replace("```", "");
  return JSON.parse(replacedOutput);
}

async function retryGenerateContent(
  model: any,
  systemInstruction: string,
  uploadedFileUri: string,
  maxRetries: number = 2,
  baseDelay: number = 1000
) {
  console.log("Generating content with retry logic...");
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);
      const response = await model.generateContent([
        systemInstruction,
        {
          fileData: {
            fileUri: uploadedFileUri,
            mimeType: "text/plain",
          },
        },
      ]);
      console.log("Original Response", response.response.text());
      const newText = extractJsonFromOutput(response.response.text());
      console.log("Extracted JSON", newText);
      return newText;
    } catch (error: any) {
      if (attempt === maxRetries) {
        console.error("Max retries reached. Failing.");
        return null;
      }
      // Special handling for specific errors
      if (error.name === "ResourceExhausted") {
        console.error("Resource exhausted. Waiting longer to retry.");
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      } else {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.error(`Error encountered: ${error}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.log("Failed to generate content after retries.");
  return null;
}

// Main handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileUri: uploadedFileUri, instructions: additionalInstructions } =
      req.body;

    // Set generation config
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 0,
      responseMimeType: "application/json",
    };

    const systemInstruction =
      baseInstruction + taskInstructions + additionalInstructions;

    // Step 2: Generate content based on system instructions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    model.generationConfig = generationConfig;
    model.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    // Use retry logic to generate content
    const result = await retryGenerateContent(
      model,
      systemInstruction,
      uploadedFileUri
    );

    if (result === null) {
      console.error("Failed to generate content after retries.");
      return res
        .status(500)
        .json({ error: "Failed to generate content after 3 retries" });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching transportation predictions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
