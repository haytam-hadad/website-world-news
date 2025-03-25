"use client"
import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "../ThemeProvider"
import SideMenuAdmin from "@/components/SideMenuAdmin"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import Link from 'next/link'


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


  if (user){
    return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 relative">

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

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-lightgrey dark:bg-thirdColor">
          <div>
            {children}
          </div>
          <Footer/>
          </div>
      </div>
    </div>
  )}else{
    return <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Unauthorized</h1>
      <p className="text-lg text-center">You need to be logged in to access this page.</p>
      <Link href="/login" className="mt-4 px-4 py-2 bg-primary text-white rounded-md">Login </Link>
    </div>
  }
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>
}

