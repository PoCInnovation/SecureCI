import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getSession({ req });

        if (!session) {
            res.status(401).json(
                { message: "Unauthorized" }
            );
            return;
        }

        const apiUrl = "https://api.github.com/user";

        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const user = await response.json();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(
            { message: "Failed to fetch user" }
        );
    }
};

export default handler;