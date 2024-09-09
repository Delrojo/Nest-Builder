import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
if (!API_KEY) {
  throw new Error("API key is missing.");
}

const deleteFileFromGemini = async (fileName: string): Promise<void> => {
  if (API_KEY.length === 0) {
    console.error("API Key is missing.");
    throw new Error("API key is missing.");
  }

  const fileManager = new GoogleAIFileManager(API_KEY);

  console.log(`Deleting file with URI: ${fileName} from Gemini...`);
  try {
    await fileManager.deleteFile(fileName);
    console.log(`File deleted successfully from Gemini.`);
  } catch (error: Error | any) {
    if (error.response && error.response.status === 404) {
      throw new Error("File not found");
    } else {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Extract the fileUri from the request body
  const { fileUri } = req.body;

  if (!fileUri) {
    return res.status(400).json({ message: "File URI is required" });
  }

  try {
    await deleteFileFromGemini(fileUri);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error: Error | any) {
    if (error.message === "File not found") {
      res.status(404).json({ message: "File not found" });
    } else {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
