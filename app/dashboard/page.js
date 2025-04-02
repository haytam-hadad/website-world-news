"use client"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ThemeContext } from "../ThemeProvider"
import Overview from "@/components/overview"

export default function OverviewPage() {
  const { user } = useContext(ThemeContext)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  return user ? (
    <Overview />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-center text-lg font-medium text-gray-900 dark:text-gray-100">
        Redirecting to login...
      </p>
    </motion.div>
  )
}

