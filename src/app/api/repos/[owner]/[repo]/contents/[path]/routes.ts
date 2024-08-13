import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../../api/auth/[...nextauth]/route";
import { z } from "zod";
import fetchURL from "../../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  path: z.string(),
});

/**
 * @swagger
 * /api/repos/{owner}/{repo}/contents/{path}:
 *   get:
 *     summary: Get content of a file in a repository
 *     description: Retrieve the content of a specific file in a repository owned by the authenticated user.
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
 *       - name: path
 *         in: path
 *         required: true
 *         description: The path to the file within the repository
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the content of the specified file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: The type of the content (file or directory)
 *                 name:
 *                   type: string
 *                   description: The name of the file or directory
 *                 path:
 *                   type: string
 *                   description: The path to the file or directory
 *                 content:
 *                   type: string
 *                   description: The content of the file, encoded in Base64 (if the file is a text file)
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch content
 */

export async function GET(
  req: NextRequest, {params}: any
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
          { message: "Invalid query parameters" },
          { status: 400 }
      );
    }

    const { owner, repo, path } = result.data

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);
    const encodedPath: string = encodeURIComponent(path);

    const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/contents/${encodedPath}`;

    const response = await fetchURL(req, apiUrl, "GET");
  
    const content: object = await response.json();
    return NextResponse.json(
      content,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch content' },
      { status: 500 }
    );
  }
};
