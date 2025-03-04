import Link from "next/link";
import { Menu, Moon, Sun, User, LogOut, Home } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import Image from "next/image";


export default function Header({ onToggleMenu }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = async () => {
    if (!user) {
      console.log('User is not logged in');
      return;
    }; // Ensure user is defined
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include session information in the request
      });
  
      if (response.status === 200) {
        console.log('Logout successful');
        setUser(null);
        window.location.href = "/";
      } else if (response.status === 401) {
        console.log('User is not logged in');
      } else if (response.status === 400) {
        console.log('An error occurred during logout');
      } else {
        console.log('Unexpected response', response.status);
      }
    } catch (error) {
      console.error('Error during logout', error);
    }
    setUser(null);
    window.location.href = "/";
  };
  
  return (
    <header className="sticky bg-white dark:bg-darkgrey select-none top-0 z-50 border-b py-1 px-10 max-sm:px-3">
      <div className="z-50 flex justify-between items-center py-3 text-maintextColor dark:text-secondaryColor gap-1">
        {/* Logo Group */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/i1.svg"
            alt="logo"
            width={45}
            height={45}
            className="dark:filter dark:invert"
          />
          <span className="font-bold text-xl ">World News</span>
          <span className="text-mainColor font-bold text-md">/ Home </span>
        </Link>

        {/* Control Group */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 rounded-full p-1 max-sm:scale-90">
            <Switch
              checked={theme}
              onCheckedChange={(checked) => setTheme(checked)}
            />
            <Label htmlFor="Dark-Mode" className="flex items-center cursor-pointer">
              {theme ? (
                <Sun className="w-5 h-5 opacity-90 "/>
              ) : (
                <Moon className="w-5 h-5 opacity-90 "/>
              )}
            </Label>
          </div>

          {user ? (
            <div className="relative rounded-full">
              <button
                className="flex items-center gap-1 rounded-full group p-1"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-mainColor text-bold text-white flex items-center justify-center">
                  {user.displayname.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold  hidden p-1 md:inline capitalize hover:underline">{user.displayname}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-20">
                  <Link href={`/profile/${user.username}`}>
                    <button
                      className="flex items-center w-full text-left px-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="mx-1" /> Profile
                    </button>
                  </Link>
                  <Link href="/">
                    <button
                      className="flex items-center w-full text-left px-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Home className="mx-1" /> Home
                    </button>
                  </Link>
                  <button
                    className="flex w-full text-red-800 dark:text-red-500 text-left px-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={logout}
                  >
                    <LogOut className="mx-1" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden ml-2 md:flex items-center gap-2">
              <Link href="/login">
                <button className="rounded-full border px-6 py-3 text-xs sm:text-sm font-semibold bg-thirdColor dark:bg-secondaryColor text-secondaryColor dark:text-mainTextColor">
                  Log in
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="rounded-full border px-6 py-3 text-xs sm:text-sm font-semibold bg-mainColor text-secondaryColor">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {/* Sidebar Toggle Button (Mobile) */}
          <Toggle
            onClick={onToggleMenu}
            className="md:hidden shadow-sm flex items-center cursor-pointer rounded-full border p-2 "
          >
            <Menu className="w-7 h-7 scale-150" />
          </Toggle>
        </div>
      </div>
    </header>
  );
}

