import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import fetchURL from '../utils/utils'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    console.log('Session:', session);

    if (!session) {
      console.error('No valid access token found in session');
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const apiUrl = 'https://api.github.com/user/repos';

    console.log('Fetching repositories with access token:', session.accessToken);

    const response = await fetchURL(req, apiUrl)

    const repositories = await response.json();
    res.status(200).json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ message: 'Failed to fetch repositories' });
  }
};

export default handler;