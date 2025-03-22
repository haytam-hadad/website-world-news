"use client"
import "../globals.css"
import Header from "@/components/Header"
import { GoUp } from "@/components/GoUp"
import SideMenu from "@/components/SideMenu"
import RightSidebar from "@/components/right-sidebar"
import { useState, useContext, useEffect } from "react"
import { motion } from "framer-motion"


// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth))
    return () => window.removeEventListener("resize", () => setWidth(window.innerWidth))
  }, [])

  return width
}

function LayoutContent({ children }) {
  const [showMenu, setShowMenu] = useState(false)
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 780
  const isWideDesktop = windowWidth >= 1100

  return (
    <div className="flex flex-col min-h-screen">
      <Header onToggleMenu={() => setShowMenu((prev) => !prev)} />
      <div className="flex relative gap-1">
        {/* Side Menu - Desktop */}
        {isDesktop && (
          <div className="w-[250px] flex-shrink-0">
            <SideMenu setVisible={setShowMenu} />
          </div>
        )}

        {/* Mobile Side Menu (Overlay) */}
        {!isDesktop && showMenu && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setShowMenu(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-[250px]" onClick={(e) => e.stopPropagation()}>
              <SideMenu setVisible={setShowMenu} />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-1 md:p-3 lg:p-4 overflow-y-auto bg-lightgrey dark:bg-thirdColor">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
          <GoUp />
        </div>

        {/* Right Sidebar - Wide Desktop Only */}
        {isWideDesktop && (
          <div className="w-[300px] flex sticky top-16 h-screen">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  )
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent> // No extra ThemeProvider here
}

