import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../../api/auth/[...nextauth]/route";
import { z } from "zod";
import fetchURL from "../../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  sha: z.string(),
});

/**
 * @swagger
 * /api/repos/{owner}/{repo}/commits/{sha}:
 *   get:
 *     summary: Get a specific commit from a repository
 *     description: Retrieve detailed information about a specific commit identified by its SHA from a repository owned by the authenticated user.
 *     tags:
 *       - Repositories
 *     parameters:
 *       - name: owner
 *         in: path
 *         required: true
 *         description: The owner of the repository
 *         schema:
 *           type: string
 *       - name: repo
 *         in: path
 *         required: true
 *         description: The name of the repository
 *         schema:
 *           type: string
 *       - name: sha
 *         in: path
 *         required: true
 *         description: The SHA hash of the commit
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns detailed information about the specified commit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sha:
 *                   type: string
 *                   description: The SHA hash of the commit
 *                 commit:
 *                   type: object
 *                   properties:
 *                     author:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the author
 *                         email:
 *                           type: string
 *                           description: The email of the author
 *                         date:
 *                           type: string
 *                           format: date-time
 *                           description: The date of the commit
 *                     message:
 *                       type: string
 *                       description: The commit message
 *                 url:
 *                   type: string
 *                   description: The URL of the commit
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch commit
 */

export async function GET(
  req: NextRequest, { params }: any
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      return;
    }

    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
          { message: "Invalid query parameters" },
          { status: 400 }
      );
    }

    const { owner, repo, sha } = result.data

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);
    const encodedSha: string = encodeURIComponent(sha);

    const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/commits/${encodedSha}`;

    const response = await fetchURL(req, apiUrl, "GET");

    const commit = await response.json();
    return NextResponse.json(
      commit,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch commit' },
      { status: 500 }
    );
  }
};
