import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Test endpoint hit");

  if (req.method !== "POST") {
    console.error("Invalid request method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Request method is POST");
  console.log("Request body:", req.body);

  res
    .status(200)
    .json({ message: "Test POST endpoint is working", data: req.body });
}
