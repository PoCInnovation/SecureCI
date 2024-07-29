"use client"
import { useState } from "react"
import { SideBar } from "../../components/ui/side-bar/side-bar"
import { useRouter } from "next/navigation"

// export const metadata = {
//     title: 'Dashboard',
//     description: 'SecureCI',
// }

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
                {children}
                <SideBar organizations={organizations} currentOrg={currentOrg}
                onChangeOrg={handleOrgChange}></SideBar>
            </body>
        </html>
    )
}
