import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { 
        owner, 
        repo 
    } = req.query;

    if (!owner || !repo) {
      res.status(400).json(
        { message: "Invalid query" }
      );
      return;
    }

    if (typeof owner !== "string" || typeof repo !== "string") {
      res.status(400).json(
        { message: "Invalid type query" }
      );
      return;
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/vulnerability-alerts`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: 'application/vnd.github.vixen-preview+json'
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vulnerabilities");
    }

    const vulnerabilities = await response.json();
    res.status(200).json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vulnerabilities" });
  }
};

export default handler;