"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/buttons/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const AuthButton = () => {
    const { data: session } = useSession();
    const defaultOrg = "personal"

    if (session) {
        return (
            <>
                {session?.user?.name} <br />
                <Button onClick={() => signOut()}>Sign Out</Button>
            </>
        )
    }
    return (
        <>
            <Button onClick={() => { signIn('github', { callbackUrl: `/orgs/${defaultOrg}`}); }}>
                <GitHubLogoIcon className="mr-2 h-4 w-4"/>
                Sign in with GitHub
            </Button>
        </>
    )
}

export default AuthButton;