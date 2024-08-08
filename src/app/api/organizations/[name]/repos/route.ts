import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import fetchURL from "../../../utils/utils";
import { z } from "zod";

const querySchema = z.object({
    name: z.string(),
});

/**
 * @swagger
 * /api/orgs/{name}/repos:
 *   get:
 *     summary: Get repositories of a GitHub organization by name
 *     description: Retrieve a list of repositories for a given GitHub organization.
 *     tags:
 *       - Organizations
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the GitHub organization
 *     responses:
 *       200:
 *         description: Returns a list of repositories for the organization
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The repository ID
 *                   name:
 *                     type: string
 *                     description: The repository name
 *                   full_name:
 *                     type: string
 *                     description: The full name of the repository
 *                   private:
 *                     type: boolean
 *                     description: Whether the repository is private
 *                   owner:
 *                     type: object
 *                     properties:
 *                       login:
 *                         type: string
 *                         description: The login of the repository owner
 *                       id:
 *                         type: integer
 *                         description: The ID of the repository owner
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch repositories
 */
export async function GET(
    req: NextRequest, {params}: any
) {
    try {
        const session = await getServerSession({ req, ...authOptions });
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const result = querySchema.safeParse(params);

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid query parameters" },
                { status: 400 }
            )
        }

        const name: string = result.data.name;

        const encodedName: string = encodeURIComponent(name);

        const apiUrl: string = `https://api.github.com/orgs/${encodedName}/repos`;

        const response: any = await fetchURL(req, apiUrl, "GET");

        const organizations: object = await response.json();

        return NextResponse.json(
            organizations,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch organizations" },
            { status: 500 }
        );
    }
}