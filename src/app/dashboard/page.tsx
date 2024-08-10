import { SideBar } from "../../components/ui/side-bar";
import { TypographyH1 } from "../../components/ui/typography/h1";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession();
  console.log('Session:', session);

  if (!session || !session.user) {
    redirect("/");
  }
}

export default Dashboard;