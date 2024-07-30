"use client"
import { AreaChart, BarChartBigIcon, BarChartIcon, Building, Building2Icon, BuildingIcon, FolderIcon, Icon, LogOut, Plus, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface SideBarChildrenProps {
    organizations: string[],
    currentOrg: string,
    onChangeOrg: (name: string) => void
}

const SideBar = ({ organizations, currentOrg, onChangeOrg }: SideBarChildrenProps) => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <aside id="sidebar" className="fixed left-0 top-0 z-40 h-screen w-[12%] transition-transform" aria-label="Sidebar">
            <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
                    <Building2Icon />
                    <DropdownMenu>
                        <DropdownMenuTrigger className="ml-3 text-base font-semibold">{currentOrg}</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {organizations?.map(org => {
                                return (
                                    <DropdownMenuItem key={org} onSelect={() => { onChangeOrg(org) }}>
                                        <span className="w-56">{org}</span>
                                    </DropdownMenuItem>
                                )
                            })}
                            <DropdownMenuItem>
                                <Plus className="mr-2 h-4 w-4" />
                                <span>Add org</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/orgs/${currentOrg}/user/account`)}>
                                <User className="mr-2 h-4 w-4"/>
                                <span>{session?.user?.name}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { signOut() }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <ul className="space-y-2 text-sm font-medium">
                    <li>
                        <a onClick={() => router.push(`/orgs/${currentOrg}`)} className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                            <AreaChart />
                            <span className="ml-3 flex-1 whitespace-nowrap">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => router.push(`/orgs/${currentOrg}/repos`)} className="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                            <FolderIcon />
                            <span className="ml-3 flex-1 whitespace-nowrap">Repositories</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export { SideBar }