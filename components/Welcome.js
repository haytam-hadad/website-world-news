"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, TrendingUp, Globe, Maximize, Minimize, MessageSquare } from "lucide-react"
import Image from "next/image"
import { ThemeContext } from "../app/ThemeProvider"

const Welcome = () => {
  const { user, isMinimized, setIsMinimized } = useContext(ThemeContext)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const welcomeRef = useRef(null)

  // Handle minimizing/maximizing the welcome section
  const handleToggleMinimize = () => {
    const newState = !isMinimized
    setIsMinimized(newState)
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("welcomeMinimized", newState.toString())
    }
  }

  // Background animation variants
  const backgroundVariants = {
    expanded: {
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
      transition: {
        duration: 12,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
    minimized: {
      scale: 1,
      opacity: 0.2,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div
      className="relative w-full overflow-hidden mb-4"
      ref={welcomeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Toggle button - only shown in expanded state */}
      {!isMinimized && (
        <motion.button
          onClick={handleToggleMinimize}
          className="absolute z-30 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-md top-3 right-3"
          aria-label="Minimize welcome section"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Minimize className="w-4 h-4" />
        </motion.button>
      )}

      {/* Hero Section - Adaptive height based on minimized state */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-r from-mainColor via-main2Color to-main2Color rounded-xl shadow-lg ${
          isMinimized ? "py-2 px-3" : "py-6 px-5 sm:py-4 sm:px-6"
        }`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: 1,
          scale: 1,
          height: isMinimized ? "auto" : "auto",
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // Custom ease curve for smoother animation
        }}
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-32 h-32 rounded-full bg-white/10 blur-3xl"
            variants={backgroundVariants}
            animate={isMinimized ? "minimized" : "expanded"}
          />

          {!isMinimized && (
            <>
              <motion.div
                className="absolute bottom-[20%] left-[15%] w-40 h-40 rounded-full bg-white/10 blur-3xl"
                initial={{ opacity: 0 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 2,
                }}
              />
              <motion.div
                className="absolute top-[40%] left-[30%] w-24 h-24 rounded-full bg-yellow-200/20 blur-2xl"
                initial={{ opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
            </>
          )}
        </div>

        {/* Content container */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isMinimized ? (
              /* Minimized state content */
              <motion.div
                key="minimized"
                className="flex flex-wrap items-center justify-between gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  {/* <Image src="/images/i1.svg" alt="Newsify Logo" width={24} height={24} className="text-white" /> */}
                  <h2 className="text-base font-bold text-white truncate max-w-[180px] sm:max-w-none">
                    <span className="text-yellow-200">Newsify:</span>{" "}
                    {user ? `Welcome, ${user.displayname}!` : "Discover News"}
                  </h2>
                </div>

                {/* Quick action buttons in minimized mode */}
                <div className="flex items-center gap-2 ml-auto">
                  <Link href="/trends">
                    <motion.button
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span className="hidden sm:inline">Trending</span>
                    </motion.button>
                  </Link>
                  <Link href="/categories">
                    <motion.button
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Globe className="w-3 h-3" />
                      <span className="hidden sm:inline">Categories</span>
                    </motion.button>
                  </Link>
                  {user && (
                    <Link href="/add">
                      <motion.button
                        className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span className="hidden sm:inline">Post</span>
                      </motion.button>
                    </Link>
                  )}

                  {/* Maximize button - positioned within the button group when minimized */}
                  <motion.button
                    onClick={handleToggleMinimize}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
                    aria-label="Expand welcome section"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Maximize className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              /* Full expanded content */
              <motion.div
                key="expanded"
                className="flex flex-col justify-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="mb-2 inline-flex mx-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                    {user ? "Your personalized news feed" : "Breaking news & trending stories"}
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center gap-2 mb-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <Image src="/images/i1.svg" alt="Newsify Logo" width={36} height={36} className="filter invert text-white " />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">Newsify</h1>
                </motion.div>

                <motion.h2
                  className="text-xl font-bold text-white mb-3 leading-tight tracking-tight"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  {user ? `Welcome back, ${user.displayname}!` : "Stay Informed with Stories That Matter"}
                  <span className="block text-yellow-200 mt-1 text-sm font-normal">
                    {user ? "Your world. Your news. Your perspective." : "Discover. Connect. Engage. Be informed."}
                  </span>
                </motion.h2>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-3 justify-center mt-2 relative z-10" // Added relative z-10
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <Link href="/trends">
                    <motion.button
                      className="bg-white text-mainColor px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50"
                      whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ y: 1 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Explore Trending
                    </motion.button>
                  </Link>

                  {user ? (
                    <Link href={`/profile/${user.username}`}>
                      <motion.button
                        className="border border-white/80 text-white hover:bg-white/10 transition-all px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ y: 1 }}
                      >
                        Your Profile
                      </motion.button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <motion.button
                        className="border border-white/80 text-white hover:bg-white/10 transition-all px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm"
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ y: 1 }}
                      >
                        Join Newsify
                      </motion.button>
                    </Link>
                  )}

                  {user && (
                    <Link href="/add">
                      <motion.button
                        className="bg-yellow-200/90 text-mainColor hover:bg-yellow-200 transition-all px-4 py-2 rounded-lg text-sm font-medium shadow-md"
                        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ y: 1 }}
                      >
                        <MessageSquare className="w-4 h-4 inline mr-1.5" />
                        Create Post
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default Welcome

