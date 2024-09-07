import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises"; // Use promises for async file operations
import axios from "axios";
import { Fields, Files, IncomingForm } from "formidable";

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

// Helper function to extract JSON from the AI output
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

// Handler function to store file temporarily and process the request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Handler function started");

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Error parsing the form data:", err);
      return res.status(500).json({ error: "Error processing the request" });
    }

    console.log("Form parsed successfully");
    console.log("Fields:", fields);
    console.log("Files:", files);

    try {
      // Step 2: Extract the file and systemInstruction from the form fields
      const file =
        files.file && Array.isArray(files.file) ? files.file[0] : files.file;
      const systemInstruction =
        fields.systemInstruction && Array.isArray(fields.systemInstruction)
          ? fields.systemInstruction[0]
          : fields.systemInstruction;

      console.log("Extracted file:", file);
      console.log("Extracted systemInstruction:", systemInstruction);

      if (!file) {
        console.error("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!systemInstruction) {
        console.error("No system instruction provided");
        return res
          .status(400)
          .json({ error: "No system instruction provided" });
      }

      // Step 3: Read the uploaded file content
      const filePath = file.filepath; // this is the temp path where the file is stored
      console.log("File path:", filePath);

      const fileContent = await fs.readFile(filePath, "utf-8");
      console.log("File content read successfully");

      // Step 4: Call the Gemini model with the file content and system instruction
      const result = await generateContentWithFile(
        fileContent,
        systemInstruction
      );

      console.log("Result from generateContentWithFile:", result);

      if (result) {
        console.log("Content generated successfully");
        return res.status(200).json({ result });
      } else {
        console.error("Failed to generate content after retries");
        return res
          .status(500)
          .json({ error: "Failed to generate content after retries" });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Clean up the temporary file after processing
      try {
        if (files.file) {
          await fs.unlink(files.file[0].filepath);
          console.log("Temporary file cleaned up successfully");
        }
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }
  });

  console.log("Handler function ended");
}
