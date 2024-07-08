import { Link } from "lucide-react"
import { buttonVariants } from "./buttons/button"
import { ButtonLink } from "./buttons/button-link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { useState } from "react"


interface Organization {
    name: string
}

interface SideBarChildrenProps {
    organizations: Organization[]
    currentOrg: Organization
}

const SideBar = ({ organizations, currentOrg }: SideBarChildrenProps) => {
    return (
        <div class="h-screen w-screen bg-white dark:bg-slate-900">
            <aside id="sidebar" class="fixed left-0 top-0 z-40 h-screen w-64 transition-transform" aria-label="Sidebar">
                <div class="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <div href="#" class="mb-10 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
                        <svg width="24" height="19" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_901_948)">
                                <path d="M21 28V2C21 1.447 20.553 1 20 1H2C1.447 1 1 1.447 1 2V31H8V25H14V31H31V8C31 8 31 7 30 7H24M16 6V8M26 12V14M26 18V20M11 6V8M6 6V8M16 12V14M11 12V14M6 12V14M16 18V20M11 18V20M6 18V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_901_948">
                                    <rect width="32" height="32" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <DropdownMenu>
                            <DropdownMenuTrigger class="ml-3 text-base font-semibold">{currentOrg.name}</DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {organizations?.map(org => {
                                    return (
                                        <DropdownMenuItem key={org.name}>
                                            <span class="w-56">{org.name}</span>
                                            </DropdownMenuItem>
                                    )
                                })}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>My Account</DropdownMenuItem>
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export { SideBar }