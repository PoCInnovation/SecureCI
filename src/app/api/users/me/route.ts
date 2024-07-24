import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import fetchURL from "../../utils/utils";

export async function GET(
    req: NextApiRequest, res: NextApiResponse
  ) {
    try {
        const session: any = await getSession({ req });
        if (!session) {
            return res.status(401).json(
                { message: "Unauthorized" }
            );
        }

        const apiUrl: string = "https://api.github.com/user";

        const response: any = await fetchURL(req, apiUrl);

        const user: object = await response.json();

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(
            { message: "Failed to fetch user" }
        );
    }
};