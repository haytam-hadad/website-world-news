"use client"
import { useContext, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronDown,
  Sparkles,
  Search,
  TrendingUp,
  Globe,
  Users,
  ArrowRight,
  Bell,
  Maximize,
  Minimize,
} from "lucide-react"
import { ThemeContext } from "../app/ThemeProvider"

const Welcome = () => {
  const { user } = useContext(ThemeContext)
  const [activeCategory, setActiveCategory] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Featured categories with icons
  const categories = [
    { name: "Technology", icon: <Globe className="w-4 h-4" /> },
    { name: "Business", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Health", icon: <Users className="w-4 h-4" /> },
  ]

  // Trending topics
  const trendingTopics = ["Artificial Intelligence", "Climate Change", "Global Economy", "Space Exploration"]

  // Check localStorage for minimized state preference on component mount
  useEffect(() => {
    const storedMinimizedState = localStorage.getItem("welcomeMinimized")
    if (storedMinimizedState !== null) {
      setIsMinimized(storedMinimizedState === "true")
    }

    setIsVisible(true)
  }, [])

  // Handle minimizing/maximizing the welcome section
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized)
    localStorage.setItem("welcomeMinimized", (!isMinimized).toString())
  }

  return (
    <div className="relative w-full overflow-hidden mb-6">
      {/* Toggle button - always visible */}
      <button
        onClick={handleToggleMinimize}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-md"
        aria-label={isMinimized ? "Expand welcome section" : "Minimize welcome section"}
      >
        {isMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
      </button>

      {/* Hero Section - Adaptive height based on minimized state */}
      <motion.div
        className={`relative overflow-hidden bg-gradient-to-r from-mainColor via-main2Color to-purple-600 rounded-2xl shadow-lg ${
          isMinimized ? "py-3 px-4" : "pt-12 pb-16 px-6 sm:px-10"
        }`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated background elements - simplified when minimized */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          {!isMinimized && (
            <>
              <motion.div
                className="absolute bottom-[5%] left-[10%] w-80 h-80 rounded-full bg-purple-400/20 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.3, 0.15],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute top-[40%] left-[60%] w-72 h-72 rounded-full bg-blue-300/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 2,
                }}
              />
            </>
          )}
        </div>

        {/* Content container */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Minimized state content */}
          {isMinimized ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                <h2 className="text-lg font-bold text-white">
                  {user ? `Welcome back, ${user.displayname}!` : "Discover the World Through News"}
                </h2>
              </div>

              {/* Quick action buttons in minimized mode */}
              <div className="flex items-center gap-2">
                <Link href="/trends">
                  <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors duration-200 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Trending</span>
                  </button>
                </Link>
                <Link href="/categories">
                  <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors duration-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Categories</span>
                  </button>
                </Link>
                <Link href="/categories">
                  <button className="px-3 opacity-0 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-colors duration-200 flex items-center gap-1.5">
                    <span className="hidden sm:inline">-</span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Full expanded content */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left column - Text content */}
              <div className="flex flex-col justify-center text-center lg:text-left">
                <motion.div
                  className="mb-3 inline-flex"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-200" />
                    {user ? "Your personalized news feed awaits" : "Breaking news & trending stories"}
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl font-bold text-white mb-4 sm:text-4xl xl:text-5xl leading-tight tracking-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  {user ? `Welcome back, ${user.displayname}!` : "Stay Informed with Stories That Matter"}
                  <span className="block text-yellow-200 mt-1">
                    {user ? "Your world. Your news." : "Discover. Connect. Engage."}
                  </span>
                </motion.h1>

                <motion.p
                  className="text-lg text-white/90 mb-6 sm:text-xl max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  {user
                    ? "We've curated the latest stories based on your interests. Dive into a personalized news experience tailored just for you."
                    : "Get real-time updates on global events, explore diverse perspectives, and join a community of informed readers from around the world."}
                </motion.p>

                {/* Trending topics */}
                <motion.div
                  className="mt-6 hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                >
                  <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                    <span className="text-white/80 text-sm">Trending:</span>
                    {trendingTopics.map((topic, index) => (
                      <Link href={`/search/${encodeURIComponent(topic.toLowerCase())}`} key={index}>
                        <span className="px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-xs transition-colors duration-200">
                          {topic}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
              {/* Right column - Visual element */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative">
                  {/* Decorative globe illustration */}
                  <div className="relative w-full h-[400px]">
                    <Image
                      src="/images/i1.svg"
                      alt="News Illustration"
                      fill
                      className="object-contain filter invert opacity-90"
                    />

                    {/* Animated notification dots */}
                    <motion.div
                      className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-red-500"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-green-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 0.5,
                      }}
                    />
                    <motion.div
                      className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-yellow-300"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                    />
                  </div>

                  {/* Floating notification cards */}
                  <AnimatePresence>
                    {isVisible && (
                      <>
                        <motion.div
                          className="absolute top-[15%] right-[5%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-lg shadow-lg max-w-[200px]"
                          initial={{ opacity: 0, y: 20, x: 20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        >
                          <div className="flex items-start gap-2">
                            <Bell className="w-4 h-4 text-mainColor mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Breaking News</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Latest updates from around the world
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          className="absolute bottom-[20%] left-[10%] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-lg shadow-lg max-w-[200px]"
                          initial={{ opacity: 0, y: 20, x: -20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.3 }}
                        >
                          <div className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Trending Topics</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">See what&apos;s popular right now</p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Featured Categories Section - Only show when not minimized */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            className="mt-8 px-4 sm:px-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Featured Categories</h2>
                <Link
                  href="/categories"
                  className="text-mainColor hover:text-main2Color text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 cursor-pointer hover:shadow-md transition-all duration-200 ${
                      activeCategory === index ? "ring-2 ring-mainColor" : ""
                    }`}
                    onClick={() => setActiveCategory(index)}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-mainColor/10 flex items-center justify-center text-mainColor">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Latest updates</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section - Only show when not minimized */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            className="mt-10 px-4 sm:px-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4">
                  <p className="text-3xl font-bold text-mainColor">10K+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Daily Readers</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-mainColor">5K+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Articles</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-mainColor">50+</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Categories</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-mainColor">24/7</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Updates</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Welcome


