import { getServerSession } from 'next-auth';
import { z } from "zod";
import fetchURL from "../../../../utils/utils";
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

/**
 * @swagger
 * /api/repos/{owner}/{repo}/releases:
 *   get:
 *     summary: Get releases of a repository
 *     description: Retrieve the releases of a specific repository belonging to the authenticated user.
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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns a list of releases of the specified repository
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The release ID.
 *                   tag_name:
 *                     type: string
 *                     description: The name of the tag associated with the release.
 *                   name:
 *                     type: string
 *                     description: The name of the release.
 *                   draft:
 *                     type: boolean
 *                     description: Whether the release is a draft.
 *                   prerelease:
 *                     type: boolean
 *                     description: Whether the release is a prerelease.
 *                   html_url:
 *                     type: string
 *                     description: The URL of the release on GitHub.
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch releases
 */

export async function GET(
  req: NextRequest, { params }: any
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      console.error('No valid access token found in session');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
          { message: "Invalid query parameters" },
          { status: 400 }
      );
    }

    const { owner, repo } = result.data

    const encodedOwner : string = encodeURIComponent(owner);
    const encodedRepo : string = encodeURIComponent(repo);

    const apiUrl : string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/releases`;

    const response = await fetchURL(req, apiUrl, "GET");

    const releases : object = await response.json();
    return NextResponse.json(
      releases, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch releases' },
      { status: 500 }
    );
  }
};
