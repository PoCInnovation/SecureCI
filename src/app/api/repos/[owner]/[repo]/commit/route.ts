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

export async function GET(
  req: NextRequest, 
  { params }: { params: { owner: string; repo: string; } }
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const queryParams = {
      ...params,
      per_page: req.nextUrl.searchParams.get('per_page') || undefined,
      page: req.nextUrl.searchParams.get('page') || undefined,
    };

    const result = querySchema.safeParse(queryParams);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { owner, repo, per_page = "100", page = "1" } = result.data;

    const encodedOwner = encodeURIComponent(owner);
    const encodedRepo = encodeURIComponent(repo);

    const apiUrl = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/commits?per_page=${per_page}&page=${page}`;

    const response = await fetchURL(req, apiUrl, "GET");

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch commits: ${response.statusText}` },
        { status: response.status }
      );
    }

    const commits = await response.json();

    return NextResponse.json(
      commits,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch commits' },
      { status: 500 }
    );
  }
};
