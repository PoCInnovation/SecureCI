import PageTitle from "@/components/ui/page-title";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Settings = async ({ params }: {
  params: { orgName: string }
}) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }
  return (
    <div>
        <PageTitle>
          Settings
        </PageTitle>
    </div>
  );
}

export default Settings;