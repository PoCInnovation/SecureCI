import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const fetchURL = async (req: NextRequest, url: string, method: string) => {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const accessToken = session.accessToken;

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    return response;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

export default fetchURL;