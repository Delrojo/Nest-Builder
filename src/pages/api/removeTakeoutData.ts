import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const API_KEY = process.env.GOOGLE_AI_API_KEY || "";

const deleteFileFromGemini = async (fileUri: string): Promise<void> => {
  if (API_KEY.length === 0) {
    console.error("API Key is missing.");
    throw new Error("API key is missing.");
  }

  console.log("In the deleteFileFromGemini function");
  const fileManager = new GoogleAIFileManager(API_KEY);

  console.log(`Deleting file with URI: ${fileUri} from Gemini...`);
  await fileManager.deleteFile(fileUri);
  console.log(`File deleted successfully from Gemini.`);
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
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
