"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/buttons/button";

const AuthButton = () => {
    const { data: session } = useSession();

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
            <p>Log in with Github</p><br/>
            <Button onClick={() => { signIn('github', { callbackUrl: "/dashboard"}); }}>
                Sign In
            </Button>
        </>
    )
}

export default AuthButton;