import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import { Fields, Files, IncomingForm } from "formidable";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("API key is missing.");
}

// Set up file manager and AI client
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

// Configuration to disable Next.js body parser
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser for form parsing
  },
};

// Helper function to upload the file to Gemini API
const uploadToGemini = async (filePath: string, mimeType: string) => {
  console.log(`Uploading file ${filePath} to Gemini...`);
  const uploadResult = await fileManager.uploadFile(filePath, { mimeType });
  const fileUri = uploadResult.file.uri;
  console.log(`File uploaded successfully with URI: ${fileUri}`);
  return fileUri;
};

// Helper function to parse form data (file + system instructions)
const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  console.log("Parsing form data...");
  const form = new IncomingForm({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return reject(err);
      }
      console.log("Form data parsed successfully.");
      resolve({ fields, files });
    });
  });
};

// Main handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Handling POST request...");

  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  let filePath = "";
  let tempTxtPath = "";

  try {
    // Parse form data to extract files and fields
    const { fields, files } = await parseForm(req);

    // Handle file extraction
    const file =
      files.file && Array.isArray(files.file) ? files.file[0] : files.file;
    const systemInstruction =
      fields.systemInstruction && Array.isArray(fields.systemInstruction)
        ? fields.systemInstruction[0]
        : fields.systemInstruction;

    if (!file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!systemInstruction) {
      console.error("No system instruction provided");
      return res.status(400).json({ error: "No system instruction provided" });
    }

    // Extract file path (adjust for your formidable version)
    filePath = (file as any).filepath || (file as any).path;
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Convert to .txt format
    tempTxtPath = `${filePath}.txt`;
    await fs.writeFile(tempTxtPath, fileContent);
    console.log(`File content written to ${tempTxtPath}`);

    // Step 1: Upload the .txt file to Gemini
    const uploadedFileUri = await uploadToGemini(tempTxtPath, "text/plain");

    // Set generation config
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 0,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    // Step 2: Generate content based on system instructions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    model.generationConfig = generationConfig;
    model.safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const result = await model.generateContent([
      systemInstruction,
      {
        fileData: {
          fileUri: uploadedFileUri,
          mimeType: "text/plain",
        },
      },
    ]);

    // Send the result back to the client
    console.log("Response from Gemini model:", result.response.text());
    res.status(200).json({ result: result.response.text() });
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Clean up temporary files
    try {
      if (filePath) await fs.unlink(filePath);
      if (tempTxtPath) await fs.unlink(tempTxtPath);
      console.log("Temporary files cleaned up.");
    } catch (err) {
      console.error("Error cleaning up temporary files:", err);
    }
  }
}
