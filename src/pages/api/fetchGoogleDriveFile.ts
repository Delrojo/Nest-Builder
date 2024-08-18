import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileId, accessToken } = req.query;

  if (!fileId || typeof fileId !== "string") {
    return res.status(400).json({ error: "File ID is required" });
  }

  if (!accessToken || typeof accessToken !== "string") {
    return res.status(400).json({ error: "Access token is required" });
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType === "text/plain") {
        const fileContent = await response.text();
        return res.status(200).json({ fileContent, contentType: "text" });
      } else if (contentType === "application/json") {
        const fileContent = await response.json();
        return res.status(200).json({ fileContent, contentType: "json" });
      } else {
        return res.status(415).json({ error: "Unsupported file type" });
      }
    } else {
      console.error("Failed to fetch file content:", response.statusText);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch file content" });
    }
  } catch (error) {
    console.error("Error fetching file content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
