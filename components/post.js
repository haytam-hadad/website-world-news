"use client"
import { Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { ThemeContext } from "../app/ThemeProvider"


const AddPostButton = () => {
  const { user } = useContext(ThemeContext)
  const pathname = usePathname()

  if (pathname === "/add" || !user) return null

  return (
    <Link href="/add">
      <button
        className="fixed z-50 bottom-16 right-3 rounded-full bg-mainColor p-2 text-white shadow-md transition-transform transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
      >
        <Plus size={24} className="pointer-events-none" />
      </button>
    </Link>
  )
}

export default AddPostButton

