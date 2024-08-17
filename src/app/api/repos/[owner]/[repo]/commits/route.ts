import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { z } from "zod";
import fetchURL from "../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
  per_page: z.string().optional(),
  page: z.string().optional(),
});

/**
 * @swagger
 * /api/repos/{owner}/{repo}/commits:
 *   get:
 *     summary: Get commits from a repository
 *     description: Retrieve a list of commits from a specific repository owned by the authenticated user.
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
 *       - name: per_page
 *         in: query
 *         required: false
 *         description: The number of commits per page (max 100)
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: The page number of the results to fetch
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns a list of commits in the specified repository
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sha:
 *                     type: string
 *                     description: The SHA hash of the commit
 *                   commit:
 *                     type: object
 *                     properties:
 *                       author:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: The name of the author
 *                           email:
 *                             type: string
 *                             description: The email of the author
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             description: The date of the commit
 *                       message:
 *                         type: string
 *                         description: The commit message
 *                   url:
 *                     type: string
 *                     description: The URL of the commit
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch commits
 */
export async function GET(
  req: NextRequest, { params }: any
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { owner, repo } = result.data;
    const per_page = result.data.per_page || "100";
    let page = result.data.page || "1";

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);
    
    let allCommits: Array<Object> = [];
    let hasMorePages = true;

    while (hasMorePages) {
      const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/commits?per_page=${per_page}&page=${page}`;
      
      const response = await fetchURL(req, apiUrl, "GET");

      if (!response.ok) {
        return NextResponse.json(
          { message: `Failed to fetch commits: ${response.statusText}` },
          { status: response.status }
        );
      }

      const commits: Array<Object> = await response.json();

      allCommits = allCommits.concat(commits);

      if (commits.length < parseInt(per_page)) {
        hasMorePages = false;
      } else {
        page = (parseInt(page) + 1).toString();
      }
    }

    return NextResponse.json(
      allCommits,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch commits' },
      { status: 500 }
    );
  }
};
