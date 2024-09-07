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
  console.log("In extractJsonFromOutput function");
  const replacedOutput = output.replace("```json", "").replace("```", "");
  return JSON.parse(replacedOutput);
}

// Helper function for retry logic
async function retryGenerateContent(
  model: any,
  systemInstruction: string,
  uploadedFileUri: string,
  maxRetries: number = 2
) {
  console.log("In retryGenerateContent function");
  let response = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);
    try {
      response = await model.generateContent([
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
    } catch (error: Error | EvalError | any) {
      if (error.name === "DeadlineExceeded") {
        console.error("Deadline exceeded. Retrying in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      } else if (error.name === "JSONDecodeError") {
        console.error("JSON decode error. Retrying in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      } else if (error.name === "ResourceExhausted") {
        console.error("Resource exhausted. Retrying in 10 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      } else if (error instanceof EvalError) {
        console.error("A value error occurred. Retrying in 1 second...");
        if (response !== null) {
          console.error(response.prompt_feedback);
          console.error(response.candidates[0].finish_reason);
          console.error(response.candidates[0].safety_ratings);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
      } else {
        console.log("Error name:", error.name);
        console.error("Unexpected error occurred:", error);
        break;
      }
    }
  }

  console.error(
    "Failed to generate content after maximum retries. And returning null"
  );
  return null; // Return null if all retries fail
}

// Main handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Trying to fetch predictions...");

  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileUri: uploadedFileUri, instructions: additionalInstructions } =
      req.body;

    console.log("Uploaded file URI:", uploadedFileUri);
    console.log("Additional instructions:", additionalInstructions);

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

    console.log(
      "Response from Gemini model in fetchPredictionsWithFile:",
      result
    );

    if (result === null) {
      console.error("Failed to generate content after retries.");
      return res
        .status(500)
        .json({ error: "Failed to generate content after 3 retries" });
    }

    // Send the result back to the client
    console.log("Successful from Gemini model:", result);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching transportation predictions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
