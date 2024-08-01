import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import fetchURL from "../../../utils/utils";
import { z } from "zod";

const querySchema = z.object({
    name: z.string(),
});

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