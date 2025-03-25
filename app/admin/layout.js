"use client"
import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "../ThemeProvider"
import SideMenuAdmin from "@/components/SideMenuAdmin"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'


function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024))


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return width
}

function LayoutContent({ children }) {
  const { user} = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false)
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 780;
  const router = useRouter();


  if (!user || user.role !== 'admin') {
    router.replace('/');
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 relative">

        {/* Side Menu - Mobile Overlay */}
        {!isDesktop && showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowMenu(false)}>
            <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 top-0 bottom-0 w-[250px] bg-white dark:bg-gray-900 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <SideMenuAdmin setVisible={setShowMenu} />
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-lightgrey dark:bg-thirdColor">
          <div>
            {children}
          </div>
          <Footer/>
          </div>
      </div>
    </div>
  )
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>
}

