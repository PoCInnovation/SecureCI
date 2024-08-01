import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';

export async function middleware(req: NextRequest) {
  try {

    const session = true;//await getServerSession({ req, ...authOptions });

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.next();
  } catch (error) {

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  matcher: [
    '/api/:path((?!auth).*)',
  ],
};