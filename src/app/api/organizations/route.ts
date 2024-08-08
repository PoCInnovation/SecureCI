import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fetchURL from "../utils/utils";

/**
 * @swagger
 * /api/user/orgs:
 *   get:
 *     summary: Get organizations for the authenticated user
 *     description: Retrieve a list of organizations that the authenticated user is a member of.
 *     tags:
 *       - Organizations
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns a list of organizations for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   login:
 *                     type: string
 *                     description: The login name of the organization
 *                   id:
 *                     type: integer
 *                     description: The ID of the organization
 *                   url:
 *                     type: string
 *                     description: The URL of the organization
 *       401:
 *         description: Unauthorized - Requires authentication
 *       500:
 *         description: Failed to fetch organizations
 */
export async function GET(
    req: NextRequest
) {
    try {
        const session = await getServerSession({ req, ...authOptions });
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const apiUrl: string = "https://api.github.com/user/orgs";

        const response: any = await fetchURL(req, apiUrl, "GET");

        const organizations: object = await response.json();

        return NextResponse.json(
            organizations,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch organizations", error },
            { status: 500 }
        );
    }
}