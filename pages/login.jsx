import React from "react";
import {useSession, signIn, signOut} from "next-auth/react";

const login = () => {
    const {data: session} = useSession()
    console.log(session)
    if (session) {
        return (
            <>
            <p>Welcome, {session.user.name}</p>
            <img src={session.user.image} alt="" style={{width: '75px', borderRadius: '50px'}} />
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}


export default login