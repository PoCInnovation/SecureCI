import PageTitle from "@/components/ui/page-title";
import { Separator } from "@/components/ui/separator";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { TypographyP } from "@/components/ui/typography/p";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

const UserAccountDetails = async ({ params }: {
  params: { orgName: string }
}) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }
  return (
      <div>
        <PageTitle>
          {session.user.name}
        </PageTitle>
        <div className="flex">
          <div>
            {(session.user.image) &&
                <Image src={session.user.image} alt="Github profile picture"
                  width={180} height={100} className="rounded-full p-4"/>
            }
          </div>
          {(session.user.email) ?
            <TypographyP>Email: {session.user.email}</TypographyP>
          : <TypographyP>Undefined email  </TypographyP>
          }
        </div>
      </div>
  );
}

export default UserAccountDetails;