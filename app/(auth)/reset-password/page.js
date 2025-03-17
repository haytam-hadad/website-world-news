"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThemeContext } from "../../ThemeProvider"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const { user } = useContext(ThemeContext)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      router.push(`/`)
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resetpwd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        }),
        credentials: "include", // Send cookies with the request
      })

      if (!response.ok) {
        if (response.status === 400) {
          setError("Invalid or expired verification code.")
        } else {
          const errorData = await response.json()
          setError(errorData?.message || "Failed to reset password. Please try again.")
        }
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection and try again.")
      console.error("Reset password error:", err)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
              Reset your password
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Enter the verification code sent to your email
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
                      <p className="text-sm font-medium">Your password has been reset successfully!</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/auth/signin"
                  className="group relative flex w-full justify-center rounded-lg border border-transparent bg-mainColor py-3 px-4 text-sm font-medium text-white hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 transition-colors duration-200"
                >
                  Go to Sign In
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

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Verification Code
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 pr-10"
                      placeholder="Enter new password"
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      tabIndex="-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 pr-10"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      tabIndex="-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
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
                    disabled={loading || !email.trim() || !otp.trim() || !newPassword.trim() || !confirmPassword.trim()}
                    className="group relative flex w-full justify-center rounded-lg border border-transparent bg-mainColor py-3 px-4 text-sm font-medium text-white hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 transition-colors duration-200 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </span>
                    ) : (
                      "Reset Password"
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
            Didn't receive the code?&nbsp;
            <Link
              href="/auth/forgot-password"
              className="font-medium text-mainColor hover:text-mainColor/80 transition-colors duration-200"
            >
              Request again
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
            <h2 className="text-3xl font-bold mb-6">Secure Your Account</h2>
            <p className="text-lg mb-8 text-white/90">
              Create a strong password to protect your account and continue enjoying our services.
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

