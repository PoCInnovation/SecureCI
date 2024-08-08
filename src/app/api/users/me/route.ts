import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import fetchURL from "../../utils/utils";


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get information about the authenticated user
 *     description: Retrieve the authenticated user's profile information. Requires a valid session. OAuth app tokens and personal access tokens (classic) need the "user" scope for private profile information. Fine-grained access tokens do not require any specific permissions.
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns information about the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 login:
 *                   type: string
 *                   description: The username of the authenticated user.
 *                 id:
 *                   type: integer
 *                   description: The ID of the authenticated user.
 *                 avatar_url:
 *                   type: string
 *                   description: The avatar URL of the authenticated user.
 *                 email:
 *                   type: string
 *                   description: The email address of the authenticated user.
 *                   nullable: true
 *                 name:
 *                   type: string
 *                   description: The full name of the authenticated user.
 *       304:
 *         description: Not modified
 *       401:
 *         description: Unauthorized - Requires authentication
 *       403:
 *         description: Forbidden - The token provided does not have the necessary permissions
 *       500:
 *         description: Failed to fetch user
 */
export async function GET(
    req: NextRequest,
  ) {
    try {
        const session: any = await getServerSession({ req, ...authOptions });
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const apiUrl: string = "https://api.github.com/user";

        const response: any = await fetchURL(req, apiUrl, "GET");

        const user: object = await response.json();

        return NextResponse.json(
            user,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch user" },
            { status: 500 }
        );
    }
};


/**
 * @swagger
 * 
 * /api/users/me:
 *   patch:
 *     summary: Update information about the authenticated user
 *     description: Update the authenticated user's profile information. Requires a valid session with a fine-grained access token that has "Profile" user permissions (write).
 *     tags:
 *       - Users
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: accept
 *         required: true
 *         description: Setting to application/vnd.github+json is recommended.
 *         schema:
 *           type: string
 *           default: application/vnd.github+json
 *       - in: body
 *         name: body
 *         description: The updated user profile information.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The new name of the user.
 *             email:
 *               type: string
 *               description: The publicly visible email address of the user.
 *             blog:
 *               type: string
 *               description: The new blog URL of the user.
 *             twitter_username:
 *               type: string
 *               nullable: true
 *               description: The new Twitter username of the user.
 *             company:
 *               type: string
 *               description: The new company of the user.
 *             location:
 *               type: string
 *               description: The new location of the user.
 *             hireable:
 *               type: boolean
 *               description: The new hiring availability of the user.
 *             bio:
 *               type: string
 *               description: The new short biography of the user.
 *     responses:
 *       200:
 *         description: Returns the updated information about the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 blog:
 *                   type: string
 *                 twitter_username:
 *                   type: string
 *                   nullable: true
 *                 company:
 *                   type: string
 *                 location:
 *                   type: string
 *                 hireable:
 *                   type: boolean
 *                 bio:
 *                   type: string
 *       304:
 *         description: Not modified
 *       401:
 *         description: Unauthorized - Requires authentication
 *       403:
 *         description: Forbidden - The token provided does not have the necessary permissions
 *       404:
 *         description: Resource not found - User does not exist
 *       422:
 *         description: Validation failed, or the endpoint has been spammed
 *       500:
 *         description: Failed to update user
 */
export async function PATCH(
    req: NextRequest,
) {
    try {
        const session: any = await getServerSession({ req, ...authOptions });
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const apiUrl: string = "https://api.github.com/user";

        const body = await req.json();
        const response: any = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: "Failed to update user", error: errorData },
                { status: response.status }
            );
        }

        const updatedUser: object = await response.json();

        return NextResponse.json(
            updatedUser,
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update user" },
            { status: 500 }
        );
    }
};