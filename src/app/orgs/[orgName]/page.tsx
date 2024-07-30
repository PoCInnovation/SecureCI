
import PageTitle from "@/components/ui/page-title";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async ({ params }: {
    params: { orgName: string }}) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div>
      <PageTitle>
        Dashboard
      </PageTitle>
    </div>
  );
}

export default Dashboard;