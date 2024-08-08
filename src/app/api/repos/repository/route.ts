import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import fetchURL from '../../utils/utils';

/**
 * @swagger
 * /api/repos/repository:
 *   get:
 *     summary: Get repositories from the authenticated user
 *     description: Retrieve a list of repositories belonging to the authenticated user. Requires a valid session with appropriate GitHub API access.
 *     tags:
 *       - Repositories
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns a list of repositories of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The repository ID.
 *                   name:
 *                     type: string
 *                     description: The repository name.
 *                   full_name:
 *                     type: string
 *                     description: The full name of the repository.
 *                   private:
 *                     type: boolean
 *                     description: Whether the repository is private.
 *                   html_url:
 *                     type: string
 *                     description: The URL of the repository on GitHub.
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch repositories
 */
export async function GET(
  req: NextRequest
) {
  try {

    const session = await getServerSession({ req, ...authOptions });
    
    if (!session) {
      console.error('No valid access token found in session');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const apiUrl = 'https://api.github.com/user/repos';

    const response = await fetchURL(req, apiUrl, "GET");
    const repositories = await response.json();

    return NextResponse.json(repositories, { status: 200 });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ message: 'Failed to fetch repositories' }, { status: 500 });
  }
}