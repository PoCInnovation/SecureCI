"use client";

import { LogOut, Plus, User, FolderKanban, ChevronRight, Moon, Sun, House, LayoutDashboard, Building } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../../assets/secure-CI.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"

interface Organization {
  name: string;
}

interface SideBarChildrenProps {
  organizations: Organization[];
  currentOrg: Organization;
}

interface Repository {
  name: string;
  owner: {
    login: string;
  };
}

const SideBar = ({ organizations, currentOrg }: SideBarChildrenProps) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [Repos, setRepos] = useState<Repository[]>([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { data: session } = useSession();

  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch("/api/repos/repository")
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data: Repository[] = await response.json();
        setRepos(data);
        
      } catch (err) {
        console.error(err);
      }
    }

    fetchRepos().catch(console.error);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
      }

      window.location.reload();
      return newDarkMode;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900">
      <aside
        id="sidebar"
        className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="ml-3 mb-10">
            <div className="flex">
              <Image src={logo} alt="Secure-CI" width={30} height={30} />
              <p className="ml-2 mt-0.5">Secure-CI</p>
            </div>
          </div>
          <div className="p-4 mb-1 flex items-center rounded-lg px-3 py-2 text-slate-900 dark:text-white">
            <House className="mr-3 ml-1 h-6 w-6 dark:text-slate-100 text-slate-900" />
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base dark:text-slate-100 text-slate-900">
                  {currentOrg.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {organizations?.map((org) => (
                    <DropdownMenuItem key={org.name}>
                      <span className="w-56">{org.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add org</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span onClick={() => router.replace('/user/me')}>
                      {session?.user?.name}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {darkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    <span onClick={toggleDarkMode}>
                      {darkMode ? "Dark mode" : "Light mode"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={() => signOut({callbackUrl: '/'})}>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="border-t ml-4 mr-4 border-slate-200 dark:border-slate-700"></div>
          <div onClick={() => router.replace('/dashboard')} className="ml-2 mt-5 p-2 flex w-11/12 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <LayoutDashboard className="mr-3 h-6 w-6 dark:text-slate-100 text-slate-900" />
            <button>Dashboard</button>
          </div>
          <div className="ml-2 p-2 flex justify-between w-11/12 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <div className="flex">
              <Building className="mr-3 mt-1 h-6 w-6 dark:text-slate-100 text-slate-900" />
              <button onClick={() => router.replace('/repository')}>Repository</button>
            </div>
            <div>
              <button 
                    onClick={toggleDropdown} 
                    className="ml-auto text-white px-3 py-1"
                    >
                    <ChevronRight
                      className={`dark:text-white text-black transform transition-transform duration-900 ${
                      isDropdownOpen ? "rotate-90" : ""
                    }`} 
                  />
                </button>
            </div>
          </div>
          <div className="border mt-2 mb-2 ml-2 mr-2"></div>
          <div className={`overflow-y-auto transition-all duration-500 ease-out ${isDropdownOpen ? "max-h-96" : "max-h-0"} max-h-transition`}>
            {Repos.map((repo) => (
              <div key={repo.name} className="ml-2 p-2 flex w-11/12 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                <FolderKanban className="mr-3 h-6 w-6 dark:text-slate-100 text-slate-900" />
                <button onClick={() => router.replace('/repository/' + repo.owner.login + '/' + repo.name)} className="truncate-text">
                  <p className="text-sm">{repo.name}</p>
                </button>
              </div>
            ))}
          </div>
          <div className="flex-grow"></div>
          <div onClick={() => router.replace('/user/me')} className="ml-2 p-2 flex w-11/12 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <User className="mr-3 h-6 w-6 dark:text-slate-100 text-slate-900" />
            <button>{session?.user?.name}</button>
          </div>
        </div>
      </aside>
    </div>
  );  
};

export { SideBar };
