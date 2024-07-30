import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../../../api/auth/[...nextauth]/route";
import { z } from "zod";
import fetchURL from "../../../../utils/utils";

const querySchema = z.object({
  owner: z.string(),
  repo: z.string(),
});

export async function GET(
  req: NextRequest, { params }: any
) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
          { message: "Invalid query parameters" },
          { status: 400 }
      );
    }

    const { owner, repo } = result.data;

    const encodedOwner: string = encodeURIComponent(owner);
    const encodedRepo: string = encodeURIComponent(repo);

    const apiUrl: string = `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/contributors`;

    const response = await fetchURL(req, apiUrl);

    const contributors: object = await response.json();
    return NextResponse.json(
      contributors,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch contributors' },
      { status: 500 }
    );
  }
};
