import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import fetchURL from "../../utils/utils";
import { z } from "zod";

const querySchema = z.object({
    name: z.string(),
});

/**
 * @swagger
 * /api/orgs/{name}:
 *   get:
 *     summary: Get details of a GitHub organization by name
 *     description: Retrieve information about a GitHub organization using the organization name.
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
 *         description: Returns the details of the organization
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: string
 *                   description: The login name of the organization
 *                 id:
 *                   type: integer
 *                   description: The ID of the organization
 *                 url:
 *                   type: string
 *                   description: The URL of the organization
 *                 description:
 *                   type: string
 *                   description: The description of the organization
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch organization
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

        const apiUrl: string = `https://api.github.com/orgs/${encodedName}`;

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