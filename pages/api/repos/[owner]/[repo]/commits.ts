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

    const { owner, repo } = req.query;

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