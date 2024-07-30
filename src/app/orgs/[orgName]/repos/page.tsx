import PageTitle from "@/components/ui/page-title";
import {
  Table, TableCaption, TableRow, TableHead,
  TableHeader, TableBody, TableCell, TableFooter
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const repositories = [
  {
    name: "Test PoC 1",
  },
  {
    name: "Test PoC 2",
  },
  {
    name: "Test PoC 3",
  },
  {
    name: "Test PoC 4",
  },
  {
    name: "Test PoC 5",
  }
]

const RepositoriesList = async ({ params }: {
  params: { orgName: string }
}) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <div>
        <PageTitle>
          Repositories from {params.orgName}
        </PageTitle>
        <Table className="table-fixed">
          <TableCaption>List of all repositories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repositories.map((repository) => (
              <TableRow key={repository.name}>
                <TableCell className="font-medium">{repository.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default RepositoriesList;