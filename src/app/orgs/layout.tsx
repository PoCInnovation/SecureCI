"use client"
import { useState } from "react"
import { SideBar } from "../../components/ui/dashboard/side-bar"
import { useRouter } from "next/navigation"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const allOrganizations: string[] = ["Epitech", "PoC", "PoCServices",
        "Personal"]
    const [currentOrg, setCurrentOrg] = useState<string>("Personal")
    const organizations = allOrganizations.filter((org) => org != currentOrg)
    const router = useRouter()

    const handleOrgChange = (org: string) => {
        setCurrentOrg(org);
        router.push(`/orgs/${org}`);
    }
    return (
        <html lang="en">
            <body>
                <div className="flex flex-row h-screen">
                    <div className="w-[12%]">
                        <SideBar organizations={organizations} currentOrg={currentOrg}
                        onChangeOrg={handleOrgChange} />
                    </div>
                    <div className="w-[88%]">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
