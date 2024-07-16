import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const fetchURL = async (req: NextApiRequest, url: string) => {
    try {
        const session = await getSession({ req });
        if (!session || !session.accessToken) {
            throw new Error("No session or access token found");
        }
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
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
