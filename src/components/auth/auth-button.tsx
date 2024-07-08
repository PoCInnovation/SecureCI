"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/buttons/button";
import { redirect } from "next/navigation";

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
            <Button onClick={() => { signIn();}}>Sign In</Button>
        </>
    )
}

export default AuthButton;