"use client";
import Link from "next/link";
import { Menu, Moon, Sun, User, LogOut } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider"; // No extra ThemeProvider
import Image from "next/image";
import Footer from "../components/Footer";

function LayoutContent({ children }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = async () => {
    if (!user) return console.log("User is not logged in");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 200) {
        console.log("Logout successful");
        setUser(null);
        window.location.href = "/";
      } else {
        console.log("Logout failed", response.status);
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <>
      <header className="sticky bg-white dark:bg-black select-none top-0 z-50 px-10 max-sm:px-5">
        <div className="flex justify-between items-center py-3 text-maintextColor dark:text-secondaryColor">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/i1.svg"
              alt="logo"
              width={50}
              height={50}
              className="dark:filter dark:invert"
            />
            <span className="font-bold text-2xl">World News</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-1 rounded-full p-1">
              <Switch checked={theme} onCheckedChange={(checked) => setTheme(checked)}/>
              <Label htmlFor="Dark-Mode" className="cursor-pointer">
                {theme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Label>
            </div>

            {/* User Dropdown */}
            {user && (
              <div className="relative">
                <button
                  className="flex items-center gap-1 rounded-full p-1"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-mainColor text-white flex items-center justify-center">
                    {user.displayname.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline capitalize hover:underline">
                    {user.displayname}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg py-1">
                    <Link href={`/profile/${user.username}`}>
                      <button className="flex w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <User className="mr-1" /> Profile
                      </button>
                    </Link>
                    <button
                      className="flex w-full text-red-800 dark:text-red-500 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={logout}
                    >
                      <LogOut className="mr-1" /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative flex">
        <div className="flex-1 p-1 md:p-3 bg-[url('/images/D2.png')] dark:bg-[url('/images/D1.png')] bg-no-repeat bg-cover">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>; // No extra ThemeProvider
}
