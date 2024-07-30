import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import fetchURL from '../../utils/utils';

export async function GET(
  req: NextRequest
) {
  try {

    const apiUrl = 'https://api.github.com/user/repos';

    const response = await fetchURL(req, apiUrl);
    const repositories = await response.json();

    return NextResponse.json(repositories, { status: 200 });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ message: 'Failed to fetch repositories' }, { status: 500 });
  }
}