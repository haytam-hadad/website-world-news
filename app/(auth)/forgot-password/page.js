"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThemeContext } from "../../ThemeProvider"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const { user } = useContext(ThemeContext)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgotpwd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        credentials: "include",
      })

      if (!response.ok) {
        const errorMessage =
          response.status === 404
            ? "No account with that email address exists."
            : (await response.json())?.message || "Failed to send verification code. Please try again."
        setError(errorMessage)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error("Forgot password error:", err)
      console.error("Response status:", response?.status)
      try {
        const errorData = await response?.json()
        console.error("Error data:", errorData)
      } catch (e) {
        console.error("Could not parse error response")
      }
      setError("An unexpected error occurred. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Form Section */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Image src="/images/i1.svg" width={60} height={60} alt="Logo" className="dark:filter dark:invert" />
            </motion.div>
            <motion.h2
              className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Forgot your password?
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enter your email and we&apos;ll send you a verification code
            </motion.p>
          </div>

          <motion.div
            className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {success ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        Verification code sent! Check your email for the 6-digit code.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/reset-password"
                  className="group relative flex w-full justify-center rounded-lg border border-transparent bg-mainColor py-3 px-4 text-sm font-medium text-white hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 transition-colors duration-200"
                >
                  Continue to Reset Password
                </Link>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    className="p-3 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="group relative flex w-full justify-center rounded-lg border border-transparent bg-mainColor py-3 px-4 text-sm font-medium text-white hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 transition-colors duration-200 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          <motion.p
            className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Remember your password?&nbsp;
            <Link
              href="/login"
              className="font-medium text-mainColor hover:text-mainColor/80 transition-colors duration-200"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Image Section */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-mainColor to-sky-500 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center text-white max-w-md"
          >
            <h2 className="text-3xl font-bold p-1 mt-10 mb-1">Account Recovery</h2>
            <p className="text-lg mb-8 text-white/90">
              We&apos;ll help you reset your password and get back to accessing the latest news and global conversations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative w-full max-w-md aspect-square"
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src="/images/i1.svg"
                width={300}
                height={300}
                alt="Logo Animation"
                className="filter invert opacity-80"
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/20 blur-md"
              animate={{
                y: [0, 15, 0],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-sky-300/30 blur-md"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

