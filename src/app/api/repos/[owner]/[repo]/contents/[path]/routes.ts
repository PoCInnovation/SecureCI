import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import fetchURL from "../../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  path: z.string(),
});

export async function GET(
  req: NextApiRequest, res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json(
        { message: "Unauthorized" }
      );
      return;
    }

    const result = querySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid query",
        errors: result.error.errors,
      });
    }

    const { owner, repo, path } = result.data

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);
    const encodedPath: string = encodeURIComponent(path);

    const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/contents/${encodedPath}`;

    const response = await fetchURL(req, apiUrl);
  
    const content: object = await response.json();
    return res.status(200).json(content);
  } catch (error) {
    return res.status(500).json(
        { message: "Failed to fetch content" }
    );
  }
};
