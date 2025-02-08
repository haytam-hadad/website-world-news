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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(
        searchQuery.trim().toLowerCase()
      )}`;
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleLangChange = (e) => {
    setSelectedLang(e.target.value);
    // You can add logic here to update the language globally if needed
  };

  return (
    <header className="sticky bg-lightgrey dark:bg-darkgrey select-none top-0 z-50 border-b border-grey-200 dark:border-gray-700 px-4 sm:px-[2%]">
      <div className="grid z-50 grid-cols-[auto,_1fr,_auto] gap-5 items-center py-4 text-maintextColor dark:text-secondaryColor">
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
        <div className="relative w-full max-w-lg mx-auto rounded-full border">
          <input
            type="text"
            placeholder="Search for news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border focus:border-2  border-mainColor rounded-full px-4 sm:px-5 h-8 sm:h-10 focus:outline-none focus:ring-0 text-primary dark:text-secondaryColor"
          />
          <Search
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 hover:border cursor-pointer p-1 rounded-full text-primary transition-colors"
          />
        </div>


        {/* Control Group */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-1 max-sm:scale-90 rounded-full border-2 border-mainColor p-1">
            <Switch checked={theme} onCheckedChange={(checked) => setTheme(checked)} />
            <Label htmlFor="Dark-Mode" className="flex items-center">
              {theme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Label>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
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
            className="md:hidden flex items-center cursor-pointer rounded border p-2"
          >
            <Menu className="w-5 h-5 text-mainColor scale-150" />
          </Toggle>
        </div>
      </div>
    </header>
  );
}

