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
  Briefcase,
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
      className="bg-white z-30 dark:bg-darkgrey border-r border-gray-100 dark:border-gray-800 w-[260px] h-full fixed top-0 pt-16 overflow-y-auto left-0 shadow-lg"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      exit={{ x: -260 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ bottom: 0 }}
    >
      <div className="flex flex-col p-4 space-y-1 ">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(!theme)}
          className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 border border-gray-100 dark:border-gray-800 sm:hidden group"
          aria-label="Toggle Dark Mode"
        >
          <div className="flex items-center gap-3 font-medium">
            <Label className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
              Theme
            </Label>
            {theme ? (
              <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
            )}
          </div>
        </button>

        {/* Home Link */}
        <Link href="/" className="block">
          <button
            onClick={() => setVisible(false)}
            className={`flex items-center w-full p-3.5 rounded-xl transition-all duration-300 ${
              activePath === "/"
                ? "bg-mainColor text-white font-medium shadow-md shadow-mainColor/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-label="Home"
          >
            <Home size={20} className={`mr-3 ${activePath === "/" ? "" : "text-mainColor"}`} />
            <span className="text-base font-medium">Home</span>
          </button>
        </Link>

        {/* Post Button (for logged in users) */}
        {user && (
          <Link href="/add" className="block">
            <button
              onClick={() => setVisible(false)}
              className={`flex items-center justify-center gap-2 w-full p-3.5 rounded-xl transition-all duration-300 ${
                activePath === "/add"
                  ? "bg-mainColor text-white font-medium shadow-md shadow-mainColor/20"
                  : "bg-mainColor/10 text-mainColor hover:bg-mainColor/20 hover:shadow-sm"
              }`}
            >
              <Plus size={20} />
              <span className="text-base font-semibold">Create Post</span>
            </button>
          </Link>
        )}

        {/* Login/Signup Buttons (for guests) */}
        {!user && (
          <div className="space-y-3 sm:hidden">
            <Link href="/login" className="block">
              <button
                onClick={() => setVisible(false)}
                className="flex items-center w-full p-3.5 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:border-gray-300 dark:hover:border-gray-600"
              >
                <LogIn size={20} className="mr-3 text-mainColor" />
                <span className="text-base font-medium">Log in</span>
              </button>
            </Link>

            <Link href="/sign-up" className="block">
              <button
                onClick={() => setVisible(false)}
                className="flex items-center justify-center w-full p-3.5 rounded-xl transition-all duration-300 bg-mainColor text-white font-medium hover:bg-mainColor/90 shadow-md shadow-mainColor/20 hover:shadow-lg hover:shadow-mainColor/30"
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
            className={`flex items-center w-full p-3.5 rounded-xl transition-all duration-300 ${
              activePath === "/trends"
                ? "bg-mainColor text-white font-medium shadow-md shadow-mainColor/20"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-label="Trends"
          >
            <ChartNoAxesCombined size={20} className={`mr-3 ${activePath === "/trends" ? "" : "text-mainColor"}`} />
            <span className="text-base font-medium">Trends</span>
          </button>
        </Link>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-900 px-2 text-xs text-gray-400 dark:text-gray-500">sections</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-3">
          <button
            className="flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 text-mainColor font-medium hover:bg-gray-50 dark:hover:bg-gray-800/70 group"
            onClick={() => setCategoriesVisible(!categoriesVisible)}
            aria-expanded={categoriesVisible}
          >
            <div className="flex items-center">
              <BookOpen size={20} className="mr-3 group-hover:text-mainColor/80 transition-colors" />
              <span className="group-hover:text-mainColor/80 transition-colors">Categories</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              {categoriesVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {categoriesVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col space-y-2 pl-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 py-1">
                  {menuItems.map(({ name, path, icon }) => (
                    <Link key={path} href={path} className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
                          activePath === path
                            ? "bg-mainColor/10 text-mainColor font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="mr-3 text-mainColor">{icon}</span>
                        <span className="text-base">{name}</span>
                      </button>
                    </Link>
                  ))}
                  <Link href="/categories" className="block mt-2">
                    <button
                      onClick={() => setVisible(false)}
                      className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 text-mainColor hover:bg-gray-50 dark:hover:bg-gray-800/70 mt-1"
                    >
                      <span className="text-base font-medium">View All Categories</span>
                      <div className="bg-mainColor/10 rounded-full p-1">
                        <ChevronRight size={14} />
                      </div>
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Personal Section (for logged in users) */}
        {user && (
          <div className="space-y-3 mt-2">
            <button
              className="flex items-center justify-between w-full p-3.5 rounded-xl transition-all duration-300 text-mainColor font-medium hover:bg-gray-50 dark:hover:bg-gray-800/70 group"
              onClick={() => setPersonalVisible(!personalVisible)}
              aria-expanded={personalVisible}
            >
              <div className="flex items-center">
                <Bell size={20} className="mr-3 group-hover:text-mainColor/80 transition-colors" />
                <span className="group-hover:text-mainColor/80 transition-colors">Personal</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                {personalVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <AnimatePresence initial={false}>
              {personalVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col space-y-2 pl-4">
                    <Link href="/saved" className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
                          activePath === "/saved"
                            ? "bg-mainColor/10 text-mainColor font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <Bookmark size={20} className="mr-3 text-mainColor" />
                        <span className="text-base">Saved</span>
                      </button>
                    </Link>
                    <Link href="/subscriptions" className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 ${
                          activePath === "/subscriptions"
                            ? "bg-mainColor/10 text-mainColor font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <Bell size={20} className="mr-3 text-mainColor" />
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

