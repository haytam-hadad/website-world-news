"use client"
import Link from "next/link"
import { Search, Menu, Moon, Sun, User, LogOut, LayoutDashboard, X, Bell } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useContext, useEffect, useRef } from "react"
import { ThemeContext } from "../app/ThemeProvider"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Header({ onToggleMenu }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const router = useRouter()
  const activePath = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && showSearch) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSearch])

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 100) // Small delay to ensure animation has started
    }
  }, [showSearch])

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = !theme
    setTheme(newTheme)

    // Apply theme class to document for immediate visual feedback
    if (newTheme) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      const isDark = savedTheme === "dark"
      setTheme(isDark)
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [setTheme])

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        setUser(null)
        router.push("/")
      }
    } catch (error) {
      console.error("Error during logout", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/search/${encodeURIComponent(searchQuery.toLowerCase())}`)
      setSearchQuery("")
      setShowSearch(false)
    }
  }

  const handleToggleMenu = () => {
      onToggleMenu()
  }

  return (
    <header className="sticky bg-white dark:bg-darkgrey top-0 z-50 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 gap-3">
          {/* Logo Group */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Image
              src="/images/i1.svg"
              alt="Newsify logo"
              width={40}
              height={40}
              className="dark:filter dark:invert transition-all duration-200 group-hover:scale-110"
            />
            <span className="font-semibold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-200 group-hover:text-mainColor dark:group-hover:text-mainColor">
            Newsify 
            </span>
          </Link>

          {/* Search Group - Only show when search is active or on larger screens */}
          {activePath.includes("search") ? null : (
            <AnimatePresence>
              {showSearch ? (
                <motion.form
                  ref={searchRef}
                  onSubmit={handleSearch}
                  className="absolute left-0 right-0 top-0 z-20 px-4 py-3 bg-white dark:bg-darkgrey border-b border-gray-200 dark:border-gray-700 md:static md:border-0 md:p-0 md:flex-1 md:max-w-lg md:mx-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-mainColor dark:focus:border-mainColor rounded-full px-4 py-2 pr-10 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-colors duration-200"
                      aria-label="Search"
                    />
                    <button
                      type="submit"
                      className="absolute right-10 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSearch(false)}
                      className="absolute right-2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      aria-label="Close search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  className="hidden md:flex justify-center flex-1 max-w-lg mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => setShowSearch(true)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-full justify-center"
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search news...</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Control Group */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Button */}
            {!activePath.includes("search") && (
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 rounded-full">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={theme}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-mainColor"
                />
                <Label htmlFor="dark-mode" className="cursor-pointer text-gray-700 dark:text-gray-300">
                  {theme ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                </Label>
              </div>
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex gap-1 items-center">
                  {/* Notifications */}
                  <button
                    className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 transition-colors duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    {user.isGoogleUser ? (
                      <Image
                        src={user.picture || "/placeholder.svg"}
                        alt={user.displayname}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-mainColor text-white flex items-center justify-center font-semibold shadow-sm">
                        {user.displayname.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium hidden md:inline capitalize text-gray-800 dark:text-gray-100">
                      {user.displayname}
                    </span>
                  </button>
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 overflow-hidden"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <button
              onClick={handleToggleMenu}
              className="md:hidden flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

