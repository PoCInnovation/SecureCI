import { SideBar } from "../../components/ui/side-bar/side-bar";
import { TypographyH1 } from "../../components/ui/typography/h1";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }
  return (
    <div>
      <h1 style={{textAlign: "right"}}>Dashboard</h1>
    </div>
  );
}

export default Dashboard;