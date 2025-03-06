"use client"

import { useState, useContext } from "react"
import { ThemeContext } from "../ThemeProvider"
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
]

const SideMenu = ({ setVisible }) => {
  const [categoriesVisible, setCategoriesVisible] = useState(true)
  const { theme, setTheme, user } = useContext(ThemeContext)
  const activePath = usePathname()

  return (
    <motion.div
      className="bg-white z-30 dark:bg-darkgrey border-r border-gray-200 dark:border-gray-700 w-[250px] h-screen fixed top-0 pt-16 overflow-y-auto left-0 shadow-md"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="flex flex-col p-4 space-y-3">
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
              className={`flex items-center outline outline-mainColor w-full p-3 rounded-lg transition-colors duration-200 ${
                activePath === "/add"
                  ? "bg-mainColor text-white font-medium"
                  : "bg-transparent text-mainColor"
              }`}
            >
              <Plus size={20} className="mr-3" />
              <span className="text-base font-semibold">POST</span>
            </button>
          </Link>
        )}

        {/* Login Button (for guests) */}
        {!user && (
          <Link href="/trends" className="block sm:hidden">
            <button
              onClick={() => setVisible(false)}
              className="flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 bg-mainColor text-white font-medium hover:bg-mainColor/90"
              aria-label="Log in"
            >
              <span className="text-base">Log in</span>
            </button>
          </Link>
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
          >
            <span>Categories</span>
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
                <div className="flex flex-col space-y-1 pl-2">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default SideMenu

