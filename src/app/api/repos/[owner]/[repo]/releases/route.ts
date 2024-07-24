// pages/api/repos/[owner]/[repo]/releases.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import fetchURL from "../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

export async function GET(
  req: NextApiRequest, res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json(
        { message: "Unauthorized" }
    );
    }

    const result = querySchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid query",
        errors: result.error.errors,
      });
    }

    const { owner, repo } = result.data

    const encodedOwner : string = encodeURIComponent(owner);
    const encodedRepo : string = encodeURIComponent(repo);

    const apiUrl : string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/releases`;

    const response = await fetchURL(req, apiUrl);

    const releases : object = await response.json();
    return res.status(200).json(releases);
  } catch (error) {
    return res.status(500).json(
        { message: "Failed to fetch releases" }
    );
  }
};
