import { redirect } from 'next/navigation';
import LoginPage from "@/components/auth/login-page";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <>
      <LoginPage />
    </>
  );
}


export default Home;