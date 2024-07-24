import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function middleware(req: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>)
{
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return handler(req);
}

export const config = {
  matcher: '/api/:path*',
};