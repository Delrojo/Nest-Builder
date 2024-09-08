import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import formidable, { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("API key is missing.");
}
export const config = {
  api: {
    bodyParser: false, // Disable bodyParser so we can manually handle file uploads
  },
};

const uploadFileToGemini = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  if (API_KEY.length === 0) {
    console.error("API Key is missing.");
    throw new Error("API key is missing.");
  }

  console.log("In the uploadFileToGemini function");
  const fileManager = new GoogleAIFileManager(API_KEY);

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
    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return reject(err);
      }
      console.log("Form data parsed successfully.");
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received request:", req.method);

  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse form data to extract files and fields
    const { files } = await parseForm(req);

    // Ensure the file object exists
    if (files.file && Array.isArray(files.file) && files.file.length > 0) {
      const file = files.file[0] as formidable.File;
      // Proceed with file processing
      const filePath = file.filepath; // or file.path in older versions
      const mimeType = file.mimetype || "text/plain"; // Use file's mimetype or default to text
      console.log("File uploaded:", filePath, "MIME type:", mimeType);

      try {
        console.log("Uploading file to Gemini...");
        const fileUri = await uploadFileToGemini(filePath, mimeType);
        console.log("File uploaded successfully. URI:", fileUri);
        res.status(200).json({ fileUri });
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        // Clean up the temporary file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting temporary file:", err);
          } else {
            console.log("Temporary file deleted successfully.");
          }
        });
      }
    } else {
      // Handle the case where files.file is undefined or empty
      console.error("No file uploaded or files.file is undefined");
      res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
