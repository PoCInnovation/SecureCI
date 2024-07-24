import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import fetchURL from "../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

const handler = async (
  req: NextApiRequest, res: NextApiResponse
) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = querySchema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid query",
        errors: result.error.errors,
      });
      return;
    }

    const { owner, repo } = result.data;

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);

    const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/contributors`;

    const response = await fetchURL(req, apiUrl);

    const contributors: object = await response.json();
    res.status(200).json(contributors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contributors" });
  }
};

export default handler;