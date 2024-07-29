
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const OrganizationDetails = async ({ params }: {
    params: { orgName: string }}) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div>
      <h1 style={{textAlign: "right"}}>{params.orgName}</h1>
      <h1 style={{textAlign: "right"}}>List orgs</h1>
    </div>
  );
}

export default OrganizationDetails;