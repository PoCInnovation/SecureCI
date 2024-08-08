import LoginPage from "@/components/auth/login-page";
import { Button } from "../components/ui/buttons/button";
import { TypographyH1 } from "../components/ui/typography/h1";
import { getServerSession } from "next-auth";

const Home = async () => {
  const session = await getServerSession();


  return (
    <>
      <LoginPage/>
    </>
  );
}

export default Home;