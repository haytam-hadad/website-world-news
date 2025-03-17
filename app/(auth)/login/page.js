"use client"

import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThemeContext } from "../../ThemeProvider"
import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { user, setUser } = useContext(ThemeContext)
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    // Check for saved username
    const savedUsername = localStorage.getItem("rememberedUsername")
    if (savedUsername) {
      setUsername(savedUsername)
      setRememberMe(true)
    }

    if (user) {
      router.push(`/`)
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Handle "remember me" functionality
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username.trim())
    } else {
      localStorage.removeItem("rememberedUsername")
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
        credentials: "include", // Send cookies with the request
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid username or password. Please try again.")
        } else {
          const errorData = await response.json()
          setError(errorData?.message || "Login failed. Please try again.")
        }
        return
      }

      const userData = await response.json()
      setUser(userData)
      router.push("/")
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection and try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    } catch (err) {
      setError(err.message || "An unexpected error occurred with Google login.")
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              Welcome back
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Sign in to your account to continue
            </motion.p>
          </div>

          <motion.div
            className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email or Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    placeholder="Enter your email or your username"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-mainColor focus:outline-none focus:ring-mainColor sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-mainColor focus:ring-mainColor"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-mainColor hover:text-mainColor/80 transition-colors duration-200"
                  >
                    Forgot your password?
                  </Link>
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
                  disabled={loading || !username.trim() || !password.trim()}
                  className="group relative flex w-full justify-center rounded-lg border border-transparent bg-mainColor py-3 px-4 text-sm font-medium text-white hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2 transition-colors duration-200 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-600 transition-colors duration-200 disabled:opacity-70"
                >
                  <Image
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    width={20}
                    height={20}
                    alt="Google logo"
                  />
                  Sign in with Google
                </button>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Don&apos;t have an account?&nbsp;
            <Link
              href="/sign-up"
              className="font-medium text-mainColor hover:text-mainColor/80 transition-colors duration-200"
            >
              Sign up now
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
            <h2 className="text-3xl font-bold mb-6">Stay Connected with the World</h2>
            <p className="text-lg mb-8 text-white/90">
              Access the latest news, share your thoughts, and join the global conversation.
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

