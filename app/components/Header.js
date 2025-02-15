"use client";
import Link from "next/link";
import { Search, Menu, Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { Globe } from "lucide-react";
import Image from "next/image";

export default function Header({ onToggleMenu }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(
        searchQuery.trim().toLowerCase()
      )}`;
    }
  };

  const handleLangChange = (e) => {
    setSelectedLang(e.target.value);
    // You can add logic here to update the language globally if needed
  };

  return (
    <header className="sticky bg-lightgrey dark:bg-darkgrey select-none top-0 z-50 border-b-2 px-5 max-sm:px-2 ">
      <div className="grid z-50 grid-cols-[auto,_1fr,_auto] items-center py-3 text-maintextColor dark:text-secondaryColor gap-2">
        
        {/* Logo Group */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/i1.svg"
            alt="logo"
            width={45}
            height={45}
            className="dark:filter dark:invert"
          />
          <span className="hidden font-bold text-xl sm:inline">World News</span>
        </Link>

        {/* Search Group */}
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto rounded-full border">
          <input
            type="text"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[alicblue] dark:bg-[#26262e] border shadow-sm border-gray-200 dark:border-gray-700 focus:border-mainColor  rounded-full px-4 sm:px-5 h-9 sm:h-10 focus:outline-none focus:ring-0 text-primary dark:text-secondaryColor"
          />
          <Search
            onClick={handleSearch}
            className="absolute hidden sm:flex right-1 top-1/2 transform -translate-y-1/2 w-7 h-7 hover:border cursor-pointer p-1 rounded-full text-primary"
          />
        </form>


        {/* Control Group */}
        <div className="flex items-center gap-1">
          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full border-2 border-mainColor max-sm:scale-90">
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

          {/* Auth Buttons */}
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

