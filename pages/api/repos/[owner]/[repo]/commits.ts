import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json(
        { message: "Unauthorized" }
      );
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

    const apiUrl : string = `https://api.github.com/repos/${owner}/${repo}/commits`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch commits");
    }

    const commits : object = await response.json();
    res.status(200).json(commits);
  } catch (error) {
    res.status(500).json(
      { message: "Failed to fetch commits" }
    );
  }
};

export default handler;