import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import fetchURL from '../../utils/utils';

export async function GET(
  req: NextRequest
) {
  try {

    const session = await getServerSession({ req, ...authOptions });
    
    if (!session) {
      console.error('No valid access token found in session');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const apiUrl = 'https://api.github.com/user/repos';

    const response = await fetchURL(req, apiUrl, "GET");
    const repositories = await response.json();

    return NextResponse.json(repositories, { status: 200 });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ message: 'Failed to fetch repositories' }, { status: 500 });
  }
}