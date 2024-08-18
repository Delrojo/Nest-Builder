import type { NextApiRequest, NextApiResponse } from "next";

const fetchPeopleInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token is required" });
  }

  const personFields = "genders,birthdays,addresses,locations";
  const url = `https://people.googleapis.com/v1/people/me?personFields=${personFields}&access_token=${token}`;
  try {
    const response = await fetch(url, {
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response from people info API", response.status);

    if (response.status === 200) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch people info" });
    }
  } catch (error) {
    console.error("Error fetching people info", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default fetchPeopleInfo;
