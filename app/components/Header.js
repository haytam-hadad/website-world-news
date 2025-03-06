"use client"
import Link from "next/link"
import { Search, Menu, Moon, Sun, User, LogOut, LayoutDashboard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { useState, useContext, useEffect, useRef } from "react"
import { ThemeContext } from "../ThemeProvider"
import Image from "next/image"

export default function Header({ onToggleMenu }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const logout = async () => {
    if (!user) {
      console.log("User is not logged in")
      return
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include session information in the request
      })

      if (response.status === 200) {
        console.log("Logout successful")
        setUser(null)
        window.location.href = "/"
      } else if (response.status === 401) {
        console.log("User is not logged in")
      } else if (response.status === 400) {
        console.log("An error occurred during logout")
      } else {
        console.log("Unexpected response", response.status)
      }
    } catch (error) {
      console.error("Error during logout", error)
    }
    setUser(null)
    window.location.href = "/"
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery.trim().toLowerCase())}`
    }
  }

  return (
    <header className="sticky bg-white dark:bg-darkgrey top-0 z-50 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-[auto,1fr,auto] items-center py-3 gap-3 sm:gap-4">
          {/* Logo Group */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/i1.svg"
              alt="logo"
              width={40}
              height={40}
              className="dark:filter dark:invert transition-all duration-200"
            />
            <span className="hidden font-bold text-xl sm:inline text-gray-800 dark:text-gray-100 transition-colors duration-200">
              World News
            </span>
          </Link>

          {/* Search Group */}
          <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-mainColor dark:focus:border-mainColor rounded-full px-4 py-2 pr-10 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Control Group */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 rounded-full">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={theme}
                  onCheckedChange={(checked) => setTheme(checked)}
                  className="data-[state=checked]:bg-mainColor"
                />
                <Label htmlFor="dark-mode" className="cursor-pointer text-gray-700 dark:text-gray-300">
                  {theme ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                </Label>
              </div>
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 transition-colors duration-200"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-mainColor text-white flex items-center justify-center font-semibold shadow-sm">
                    {user.displayname.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium hidden md:inline capitalize text-gray-800 dark:text-gray-100">
                    {user.displayname}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 overflow-hidden">
                    <Link href={`/profile/${user.username}`}>
                      <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </button>
                    </Link>
                    <Link href={`/update-info`}>
                      <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        <span>Dashboard</span>
                      </button>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      className="flex items-center w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <button className="rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    Log in
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="rounded-full px-4 py-2 text-sm font-medium bg-mainColor hover:bg-mainColor/90 text-white transition-colors duration-200">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {/* Sidebar Toggle Button (Mobile) */}
            <Toggle
              onClick={onToggleMenu}
              className="md:hidden flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </Toggle>
          </div>
        </div>
      </div>
    </header>
  )
}

