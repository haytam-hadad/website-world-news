"use client"
import { useContext } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown, Sparkles } from "lucide-react"
import { ThemeContext } from "../ThemeProvider"

const Welcome = () => {
  const { user } = useContext(ThemeContext)

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-mainColor to-main2Color my-4 py-14 px-6 sm:px-10 rounded-2xl shadow-lg"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-sky-300/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
        <motion.div
          className="mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Sparkles className="w-8 h-8 text-yellow-200 mb-2" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-white mb-4 sm:text-4xl xl:text-5xl leading-tight tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {user ? `Welcome back, ${user.displayname}!` : "Discover the World Through News"}
        </motion.h1>

        <motion.p
          className="text-lg text-white/90 mb-8 sm:text-xl max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {user
            ? "Stay informed with the latest stories from around the globe. Your personalized news experience awaits."
            : "Explore diverse perspectives, share your insights, and connect with a community of informed readers from across the globe."}
        </motion.p>

        <motion.div
          className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link href="/trends" className="w-full sm:w-auto">
            <motion.button
              className="bg-white text-mainColor px-6 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-50 group"
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
            >
              Explore Latest News
              <ChevronDown className="inline-block w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </motion.button>
          </Link>

          {user ? (
            <Link href={`/profile/${user.username}`} className="w-full sm:w-auto">
              <motion.button
                className="border-2 border-white/80 text-white hover:bg-white/10 transition-all px-6 py-3.5 rounded-xl font-semibold w-full sm:w-auto backdrop-blur-sm"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                View Your Profile
              </motion.button>
            </Link>
          ) : (
            <Link href="/login" className="w-full sm:w-auto">
              <motion.button
                className="border-2 border-white/80 text-white hover:bg-white/10 transition-all px-6 py-3.5 rounded-xl font-semibold w-full sm:w-auto backdrop-blur-sm"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                Join the Conversation
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Welcome

