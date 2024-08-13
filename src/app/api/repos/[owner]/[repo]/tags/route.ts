import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { z } from "zod";
import fetchURL from "../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

/**
 * @swagger
 * /api/repos/{owner}/{repo}/tags:
 *   get:
 *     summary: Get tags of a repository
 *     description: Retrieve the tags of a specific repository belonging to the authenticated user.
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
 *         description: Returns a list of tags of the specified repository
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the tag.
 *                   commit:
 *                     type: object
 *                     properties:
 *                       sha:
 *                         type: string
 *                         description: The commit SHA associated with the tag.
 *                       url:
 *                         type: string
 *                         description: The URL of the commit associated with the tag.
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch tags
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

    const apiUrl : string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/tags`;

    const response = await fetchURL(req, apiUrl, "GET");

    const tags : object = await response.json();
    return NextResponse.json(
      tags, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
};
