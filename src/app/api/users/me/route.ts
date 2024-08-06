import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import fetchURL from "../../utils/utils";

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