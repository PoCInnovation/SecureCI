import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fetchURL from "../utils/utils";

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

        const apiUrl: string = "https://api.github.com/organizations";

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