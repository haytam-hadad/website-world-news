"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../app/ThemeProvider"
import {
  Home,
  FileText,
  Layers,
  Tag,
  Users,
  Settings,
  Edit3,
  Sun,
  Moon,
  BarChart3,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

// Update the menuItems array with the correct paths
const menuItems = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: <Home size={20} />,
  },
  {
    name: "Update Info",
    path: "/update-info",
    icon: <Edit3 size={20} />,
  },
]

const contentItems = [
  {
    name: "Articles",
    path: "/dashboard/articles",
    icon: <FileText size={20} />,
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
    icon: <Layers size={20} />,
  },
  {
    name: "Tags",
    path: "/dashboard/tags",
    icon: <Tag size={20} />,
  },
]

const adminItems = [
  {
    name: "Users",
    path: "/dashboard/users",
    icon: <Users size={20} />,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
]

const SideMenuDashboard = ({ setVisible }) => {
  const [contentVisible, setContentVisible] = useState(true)
  const [adminVisible, setAdminVisible] = useState(false)
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
      className="bg-gradient-to-r from-mainColor to-main2Color text-white select-none p-4 z-40 w-[250px] h-full fixed top-16 overflow-y-auto left-0"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.25 }}
      style={{ bottom: 0 }} // Ensure it doesn't extend beyond the viewport
    >
      <div className="flex flex-col space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(!theme)}
          className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200 hover:bg-primary border border-primary/30 sm:hidden"
          aria-label="Toggle Dark Mode"
        >
          <div className="flex items-center gap-3 font-medium">
            <Label className="text-white">Theme</Label>
            {theme ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-200" />}
          </div>
        </button>

        {/* Main Menu Items */}
        {menuItems.map(({ name, path, icon }) => (
          <Link href={path} key={path} className="block">
            <button
              onClick={() => setVisible(false)}
              className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                activePath === path
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-white hover:bg-primary/20"
              }`}
            >
              <span className="mr-3">{icon}</span>
              <span className="text-base">{name}</span>
            </button>
          </Link>
        ))}

        {/* Content Section */}
        <div className="space-y-2 pt-2">
          <button
            className="flex items-center justify-between w-full p-2 text-white font-medium hover:bg-primary/20 rounded-lg transition-colors duration-200"
            onClick={() => setContentVisible(!contentVisible)}
            aria-expanded={contentVisible}
          >
            <div className="flex items-center">
              <BookOpen size={20} className="mr-3" />
              <span>Content</span>
            </div>
            {contentVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence initial={false}>
            {contentVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col space-y-1 pl-2">
                  {contentItems.map(({ name, path, icon }) => (
                    <Link key={path} href={path} className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-2.5 rounded-lg transition-colors duration-200 ${
                          activePath === path
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-white hover:bg-primary/20"
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

        {/* Admin Section */}
        <div className="space-y-2 pt-2">
          <button
            className="flex items-center justify-between w-full p-2 text-white font-medium hover:bg-primary/20 rounded-lg transition-colors duration-200"
            onClick={() => setAdminVisible(!adminVisible)}
            aria-expanded={adminVisible}
          >
            <div className="flex items-center">
              <Settings size={20} className="mr-3" />
              <span>Administration</span>
            </div>
            {adminVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          <AnimatePresence initial={false}>
            {adminVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col space-y-1 pl-2">
                  {adminItems.map(({ name, path, icon }) => (
                    <Link key={path} href={path} className="block">
                      <button
                        onClick={() => setVisible(false)}
                        className={`flex items-center w-full p-2.5 rounded-lg transition-colors duration-200 ${
                          activePath === path
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-white hover:bg-primary/20"
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

        {/* Analytics Link */}
        <Link href="/dashboard/analytics" className="block pt-2">
          <button
            onClick={() => setVisible(false)}
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
              activePath === "/dashboard/analytics"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-white hover:bg-primary/20"
            }`}
            aria-label="Analytics"
          >
            <BarChart3 size={20} className="mr-3" />
            <span className="text-base">Analytics</span>
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export default SideMenuDashboard

