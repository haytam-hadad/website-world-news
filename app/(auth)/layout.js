"use client"
import { useContext } from "react"
import { ThemeContext } from "../ThemeProvider"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/Footer"

function LayoutContent({ children }) {
  const { theme, setTheme, user, setUser } = useContext(ThemeContext)

  return (
    <div>
      <button
        onClick={() => window.location.href = '/'}
        className="fixed top-4 left-4 rounded-full text-secondaryColor bg-secondary-foreground hover:bg-mainColor hover:text-secondaryColor text-md z-30 border p-2 px-3 font-bold shadow-md dark:bg-gray-800 dark:text-white flex items-center"
      >
        <ArrowLeft className="h-5 w-5 text-secondaryColor" />
        <span className="mx-3">Go Home</span>
      </button>
      <main className="relative flex">
        <div className="flex-1">{children}</div>
      </main>
      <Footer/>
    </div>
  )
}

export default function MainLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>
}

