"use client"
import { LogOut, Plus, User } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu/dropdown-menu"
import { signOut, useSession } from "next-auth/react"


interface Organization {
    name: string
}

interface SideBarChildrenProps {
    organizations: Organization[]
    currentOrg: Organization
}

const SideBar = ({ organizations, currentOrg }: SideBarChildrenProps) => {
    const { data: session } = useSession();

    return (
        <div className="h-screen w-screen bg-white dark:bg-slate-900">
            <aside id="sidebar" className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform" aria-label="Sidebar">
                <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
                        <svg width="24" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_901_948)">
                                <path d="M21 28V2C21 1.447 20.553 1 20 1H2C1.447 1 1 1.447 1 2V31H8V25H14V31H31V8C31 8 31 7 30 7H24M16 6V8M26 12V14M26 18V20M11 6V8M6 6V8M16 12V14M11 12V14M6 12V14M16 18V20M11 18V20M6 18V20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_901_948">
                                    <rect width="32" height="32" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="ml-3 text-base font-semibold">{currentOrg.name}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {organizations?.map(org => {
                                    return (
                                        <DropdownMenuItem key={org.name}>
                                            <span className="w-56">{org.name}</span>
                                            </DropdownMenuItem>
                                    )
                                })}
                                <DropdownMenuItem>
                                    <Plus className="mr-2 h-4 w-4"/>
                                    <span>Add org</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    {session?.user?.name}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span onClick={() => { signOut() }}>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export { SideBar }