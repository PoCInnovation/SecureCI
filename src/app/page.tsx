import AuthButton from "@/components/auth/auth-button";
import { TypographyH1 } from "../components/ui/typography/h1";
import { TypographyP } from "@/components/ui/typography/p";

const Home = async () => {
  return (
    <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          
          <div className="text-2xl font-semibold tracking-tight">
            <TypographyH1>
              SecureCI
            </TypographyH1>
          </div>
          <TypographyP>
            Scan your codebase for vulnerabilities before shipping
          </TypographyP>
          <AuthButton/>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;