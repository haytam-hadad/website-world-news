"use client"
import "../globals.css"
import Header from "@/components/Header"
import { GoUp } from "@/components/GoUp"
import SideMenu from "@/components/SideMenu"
import Welcome from "@/components/Welcome"
import { ThemeContext } from "../ThemeProvider"
import { useState, useContext, useEffect, useCallback } from "react"


// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)

  const handleResize = useCallback(() => setWidth(window.innerWidth), [])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  return width
}

function LayoutContent({ children }) {
  const { theme } = useContext(ThemeContext)
  const [showMenu, setShowMenu] = useState(false)
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 768

  return (
    <div className="flex flex-col min-h-screen">
      <Header onToggleMenu={() => setShowMenu((prev) => !prev)} />
      <div className="flex flex-1 relative">
        {/* Side Menu - Desktop */}
        {isDesktop && (
          <div className="w-[250px] flex-shrink-0">
            <SideMenu setVisible={setShowMenu} />
          </div>
        )}

        {/* Mobile Side Menu (Overlay) */}
        {!isDesktop && showMenu && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMenu(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-[250px]" onClick={(e) => e.stopPropagation()}>
              <SideMenu setVisible={setShowMenu} />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-1 md:p-3 overflow-y-auto bg-lightgrey dark:bg-thirdColor">
          {children}</div>
      </div>
      <GoUp />
    </div>
  )
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent> // No extra ThemeProvider here
}

