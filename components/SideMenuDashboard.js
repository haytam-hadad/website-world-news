"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../app/ThemeProvider"
import { Home, FileText, Layers, Tag, Users, Settings, Edit3, Sun, Moon, BarChart3, User, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

const SideMenuDashboard = ({ setVisible }) => {
  const { theme, setTheme, user } = useContext(ThemeContext)
  const activePath = usePathname()

  // All menu items in a single array
  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Profile",
      path: user ? `/profile/${user.username}` : "/profile",
      icon: <User size={20} />,
    },
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
    {
      name: "Analytics",
      path: "/dashboard/analytics",
      icon: <BarChart3 size={20} />,
    }
  ]

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
      className="bg-gradient-to-r from-mainColor to-main2Color text-white select-none p-3 z-40 w-[250px] h-full fixed top-16 overflow-y-auto left-0"
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

        {/* All Menu Items */}
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
      </div>
    </motion.div>
  )
}

export default SideMenuDashboard