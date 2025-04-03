"use client"

import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "../app/ThemeProvider"
import { Home, FileText, Layers, Tag, Settings, Edit3, Sun, Moon, BarChart3, User, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const SideMenuDashboard = ({ setVisible }) => {
  const { theme, setTheme, user } = useContext(ThemeContext)
  const activePath = usePathname()
  const [expandedSections, setExpandedSections] = useState(["dashboard", "account"])

  // Dashboard menu items
  const dashboardItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: <BarChart3 size={20} />,
    }
  ]

  // Account menu items
  const accountItems = [
    {
      name: "Profile",
      path: user ? `/profile/${user.username}` : "/profile",
      icon: <User size={20} />,
    },
    {
      name: "Update Info",
      path: "/dashboard/update-info",
      icon: <Edit3 size={20} />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={20} />,
    },
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
      className="bg-gradient-to-r from-mainColor to-main2Color text-white select-none p-3 z-40 w-[260px] h-full fixed top-16 overflow-y-auto left-0"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      exit={{ x: -260 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ bottom: 0 }} // Ensure it doesn't extend beyond the viewport
    >
      <div className="flex flex-col space-y-4 pt-2">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(!theme)}
          className="flex items-center justify-between p-3 rounded-lg transition-colors duration-200 hover:bg-white/10 border border-white/20 sm:hidden group"
          aria-label="Toggle Dark Mode"
        >
          <div className="flex items-center gap-3 font-medium">
            <Label className="text-white group-hover:text-white/90 transition-colors">Theme</Label>
            {theme ? (
              <Sun className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-200 group-hover:text-indigo-100 transition-colors" />
            )}
          </div>
        </button>

        {/* Home Link */}
        <Link href="/" className="block">
          <button
            onClick={() => setVisible(false)}
            className={`flex items-center w-full p-3 rounded-lg  ${ activePath === "/" 
              ? "bg-white text-mainColor font-medium shadow-md" : "text-white hover:bg-white/10"
            }`}
            aria-label="Home"
          >
            <Home size={20} className="mr-3" />
            <span className="text-base font-medium">Home</span>
          </button>
        </Link>

        {/* Dashboard Section */}
        <Accordion type="multiple" defaultValue={expandedSections} className="space-y-2 border-none">
          <AccordionItem value="dashboard" className="border-none gap-2">
            <AccordionTrigger className="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 text-white font-medium hover:bg-white/10 group hover:no-underline py-0">
              <div className="flex items-center">
                <Layers size={20} className="mr-3 group-hover:text-white/90 transition-colors" />
                <span className="group-hover:text-white/90 transition-colors p-2">Dashboard</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0 px-2">
              <div className="flex flex-col space-y-1">
                {dashboardItems.map(({ name, path, icon }) => (
                  <Link key={path} href={path} className="block">
                    <button
                      onClick={() => setVisible(false)}
                      className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-200 ${
                        activePath === path
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="mr-3">{icon}</span>
                      <span className="text-sm">{name}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Account Section */}
          <AccordionItem value="account" className="border-none gap-2">
            <AccordionTrigger className="flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 text-white font-medium hover:bg-white/10 group hover:no-underline py-0">
              <div className="flex items-center">
                <User size={20} className="mr-3 group-hover:text-white/90 transition-colors" />
                <span className="group-hover:text-white/90 transition-colors p-2">Account</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0 px-2">
              <div className="flex flex-col space-y-1">
                {accountItems.map(({ name, path, icon }) => (
                  <Link key={path} href={path} className="block">
                    <button
                      onClick={() => setVisible(false)}
                      className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-200 ${
                        activePath === path
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="mr-3">{icon}</span>
                      <span className="text-sm">{name}</span>
                    </button>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </motion.div>
  )
}

export default SideMenuDashboard

