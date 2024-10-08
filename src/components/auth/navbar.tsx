"use client";

import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../../assets/secure-CI.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const mode: string | null = localStorage.getItem("darkMode");
    const isDarkMode = mode === "true";
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setDarkMode(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80`}>
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <div className="mr-3 mt-1">
              <Image src={logo} alt="Secure-CI" width={30} height={30} />
            </div>
            <span className="text-xl tracking-tight">Secure-CI</span>
          </div>
          <div className="hidden lg:flex justify-center space-x-12 items-center cursor-pointer">
            <a onClick={() => { signIn('github', { callbackUrl: "/dashboard"})} } className="py-2 px-3 border rounded-md">
              Get started
            </a>
            <button onClick={toggleDarkMode} aria-label="Toggle dark mode" className="py-2 px-3 border rounded-md">
              {darkMode ? <Moon /> : <Sun />}
            </button>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className={`fixed right-0 z-20 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'} w-full p-12 flex flex-col justify-center items-center lg:hidden`}>
            <div className="flex space-x-6">
              <a onClick={() => signIn()} className="py-2 px-3 border rounded-md cursor-pointer">
                Get started
              </a>
              <button onClick={toggleDarkMode} className="py-2 px-3 border rounded-md">
                {darkMode ? <Sun /> : <Moon />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;