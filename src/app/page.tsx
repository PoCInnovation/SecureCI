import AuthButton from "@/components/auth/auth-button";
import { Button } from "../components/ui/buttons/button";
import { TypographyH1 } from "../components/ui/typography/h1";
import { getServerSession } from "next-auth";

const Home = async () => {
  return (
    <>
      <TypographyH1>SecureCI</TypographyH1>
      <AuthButton/>
    </>
  );
}

export default Home;