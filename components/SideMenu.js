"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../app/ThemeProvider"
import {
  Home,
  Laptop,
  HeartPulse,
  Trophy,
  Landmark,
  BarChartIcon as ChartNoAxesCombined,
  ChevronUp,
  ChevronDown,
  TestTube,
  Plus,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  BookOpen,
  Bell,
  Bookmark,
  ChevronRight,
  Briefcase
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    name: "Technology",
    path: "/category/technology",
    icon: <Laptop size={20} />,
  },
  { name: "Health", path: "/category/health", icon: <HeartPulse size={20} /> },
  { name: "Sports", path: "/category/sports", icon: <Trophy size={20} /> },
  {
    name: "Politics",
    path: "/category/politics",
    icon: <Landmark size={20} />,
  },
  { name: "Science", path: "/category/science", icon: <TestTube size={20} /> },
  {
    name: "Business",
    path: "/category/business",
    icon: <Briefcase size={20} />,
  },
]

const SideMenu = ({ setVisible }) => {
  const [categoriesVisible, setCategoriesVisible] = useState(true)
  const [personalVisible, setPersonalVisible] = useState(true)
  const { theme, setTheme, user } = useContext(ThemeContext)
  const activePath = usePathname()

  // Close the mobile menu when navigating to a new page
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof setVisible === "function") {
        setVisible(false)
      }
    }

    // Listen for pathname changes
    return () => {
      handleRouteChange()
    }
  }, [activePath, setVisible])

  return (
    <motion.div
      className="bg-white z-30 dark:bg-darkgrey border-r border-gray-200 dark:border-gray-700 w-[250px] h-full fixed top-0 pt-16 overflow-y-auto left-0 shadow-md"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ bottom: 0 }} // Ensure it doesn't extend beyond the viewport
    >
      <div className="flex flex-col p-3 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(!theme)}
          className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 sm:hidden"
          aria-label="Toggle Dark Mode"
        >
          <div className="flex items-center gap-3 font-medium">
            <Label className="text-gray-700 dark:text-gray-300">Theme</Label>
            {theme ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </div>
        </button>

        {/* Home Link */}
        <Link href="/" className="block">
          <button
            onClick={() => setVisible(false)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              activePath === "/"
                ? "bg-mainColor text-white font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Home"
          >
            <Home size={20} className="mr-3" />
            <span className="text-base">Home</span>
          </button>
        </Link>

        {/* Post Button (for logged in users) */}
        {user && (
          <Link href="/add" className="block">
            <button
              onClick={() => setVisible(false)}
              className={`flex items-center justify-center gap-2 w-full outline p-3 rounded-lg transition-colors duration-200 ${
                activePath === "/add"
                  ? "bg-mainColor text-white font-medium"
                  : "bg-mainColor/10 text-mainColor hover:bg-mainColor/20"
              }`}
            >
              <Plus size={20} />
              <span className="text-base font-semibold">Create Post</span>
            </button>
          </Link>
        )}

        {/* Login/Signup Buttons (for guests) */}
        {!user && (
          <div className="space-y-2 sm:hidden">
            <Link href="/login" className="block">
              <button
                onClick={() => setVisible(false)}
                className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                <LogIn size={20} className="mr-3" />
                <span className="text-base">Log in</span>
              </button>
            </Link>

            <Link href="/sign-up" className="block">
              <button
                onClick={() => setVisible(false)}
                className="flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 bg-mainColor text-white font-medium hover:bg-mainColor/90"
              >
                <UserPlus size={20} className="mr-3" />
                <span className="text-base">Sign up</span>
              </button>
            </Link>
          </div>
        )}

        {/* Trends Link */}
        <Link href="/trends" className="block">
          <button
            onClick={() => setVisible(false)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              activePath === "/trends"
                ? "bg-mainColor text-white font-medium"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-label="Trends"
          >
            <ChartNoAxesCombined size={20} className="mr-3" />
            <span className="text-base">Trends</span>
          </button>
        </Link>

        {/* Divider */}
        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Categories Section */}
        <div className="space-y-2">
          <button
            className="flex items-center justify-between w-full p-2 text-mainColor font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            onClick={() => setCategoriesVisible(!categoriesVisible)}
            aria-expanded={categoriesVisible}
          >
            <div className="flex items-center">
              <BookOpen size={20} className="mr-3" />
              <span>Categories</span>
            </div>
            {categoriesVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence initial={false}>
            {categoriesVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col space-y-1 pl-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
                  {menuItems.map(({ name, path, icon }) => (
                    <Link key={path} href={path} className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-2.5 rounded-lg transition-colors duration-200 ${
                          activePath === path
                            ? "bg-mainColor text-white font-medium"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <span className="mr-3">{icon}</span>
                        <span className="text-base">{name}</span>
                      </button>
                    </Link>
                  ))}
                  <Link href="/categories" className="block">
                    <button
                      onClick={() => setVisible(false)}
                      className="flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 text-mainColor hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-base font-medium">View All Categories</span>
                      <ChevronRight size={17} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Personal Section (for logged in users) */}
        {user && (
          <div className="space-y-2">
            <button
              className="flex items-center justify-between w-full p-2 text-mainColor font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={() => setPersonalVisible(!personalVisible)}
              aria-expanded={personalVisible}
            >
              <div className="flex items-center">
                <Bell size={20} className="mr-3" />
                <span>Personal</span>
              </div>
              {personalVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <AnimatePresence initial={false}>
              {personalVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col space-y-1 pl-2">
                    <Link href="/saved" className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-2.5 rounded-lg transition-colors duration-200 ${
                          activePath === "/saved"
                            ? "bg-mainColor text-white font-medium"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Bookmark size={20} className="mr-3" />
                        <span className="text-base">Saved</span>
                      </button>
                    </Link>
                    <Link href="/subscriptions" className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-2.5 rounded-lg transition-colors duration-200 ${
                          activePath === "/subscriptions"
                            ? "bg-mainColor text-white font-medium"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Bell size={20} className="mr-3" />
                        <span className="text-base">Subscriptions</span>
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SideMenu
