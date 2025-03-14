"use client"
import { useContext, useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, TrendingUp, Globe, Maximize, Minimize, MessageSquare } from "lucide-react"
import { ThemeContext } from "../app/ThemeProvider"

const Welcome = () => {
  const { user, isMinimized, setIsMinimized } = useContext(ThemeContext)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  // Set visibility after component mounts for animations
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Handle minimizing/maximizing the welcome section
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized)
    // Save preference to localStorage
    localStorage.setItem("welcomeMinimized", (!isMinimized).toString())
  }

  return (
    <div className="relative w-full overflow-hidden mb-4">
      {/* Toggle button - positioned differently based on minimized state */}
      <button
        onClick={handleToggleMinimize}
        className={`absolute z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-md ${
          isMinimized ? "top-1/2 -translate-y-1/2 right-3" : "top-3 right-3"
        }`}
        aria-label={isMinimized ? "Expand welcome section" : "Minimize welcome section"}
      >
        {isMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
      </button>

      {/* Hero Section - Adaptive height based on minimized state */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-r from-mainColor via-main2Color to-main2Color rounded-xl shadow-lg ${
          isMinimized ? "py-2 px-3" : "py-4 px-4"
        }`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated background elements - simplified when minimized */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-32 h-32 rounded-full bg-white/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Content container */}
        <div className="relative z-10">
          {/* Minimized state content */}
          {isMinimized ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <h2 className="text-base font-bold text-white truncate max-w-[180px] sm:max-w-none">
                  {user ? `Welcome, ${user.displayname}!` : "Discover News"}
                </h2>
              </div>

              {/* Quick action buttons in minimized mode */}
              <div className="flex items-center gap-2 ml-auto">
                <Link href="/trends">
                  <button className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Trending</span>
                  </button>
                </Link>
                <Link href="/categories">
                  <button className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    <span className="hidden sm:inline">Categories</span>
                  </button>
                </Link>
                {user && (
                  <Link href="/add">
                    <button className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      <span className="hidden sm:inline">Post</span>
                    </button>
                  </Link>
                )}
                <span className="opacity-0 mx-3">-</span>
              </div>
            </div>
          ) : (
            /* Full expanded content - simplified version */
            <div className="flex flex-col justify-center text-center">
              <motion.div
                className="mb-2 inline-flex mx-auto"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  {user ? "Your personalized feed" : "Breaking news & stories"}
                </span>
              </motion.div>

              <motion.h1
                className="text-xl font-bold text-white mb-2 leading-tight tracking-tight"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {user ? `Welcome back, ${user.displayname}!` : "Stay Informed with Stories That Matter"}
                <span className="block text-yellow-200 mt-1 text-sm">
                  {user ? "Your world. Your news." : "Discover. Connect. Engage."}
                </span>
              </motion.h1>

              {/* CTA Buttons */}
              <motion.div
                className="flex gap-2 justify-center mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <Link href="/trends">
                  <motion.button
                    className="bg-white text-mainColor px-3 py-1.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-1 transition-all duration-300 hover:bg-gray-50"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 1 }}
                  >
                    Explore News
                  </motion.button>
                </Link>

                {user ? (
                  <Link href={`/profile/${user.username}`}>
                    <motion.button
                      className="border border-white/80 text-white hover:bg-white/10 transition-all px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 1 }}
                    >
                      Your Profile
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button
                      className="border border-white/80 text-white hover:bg-white/10 transition-all px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm"
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 1 }}
                    >
                      Join Now
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Welcome

