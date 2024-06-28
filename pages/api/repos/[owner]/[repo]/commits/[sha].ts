import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { owner, repo, sha } = req.query;

    const apiUrl: string = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch commit files");
    }

    const commit = await response.json();
    res.status(200).json(commit.files);
  } catch (error) {
    res.status(500).json(
        { message: "Failed to fetch commit files" }
    );
  }
};

export default handler;
