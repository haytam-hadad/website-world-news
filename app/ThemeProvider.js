"use client"
import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setThemeState] = useState(false)
  const [user, setUser] = useState(null)
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("isMinimized")
      return savedState !== null ? JSON.parse(savedState) : false
    }
    return false
  })

  // Initialize theme based on user preference or system preference
  useEffect(() => {
    const initializeTheme = async () => {
      if (typeof window !== "undefined") {
        // Check for saved preference first
        const savedTheme = localStorage.getItem("theme")

        if (savedTheme !== null) {
          const isDark = savedTheme === "true"
          setThemeState(isDark)
          document.documentElement.classList.toggle("dark", isDark)
        } else {
          // If no saved preference, use system preference
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          setThemeState(prefersDark)
          document.documentElement.classList.toggle("dark", prefersDark)
          localStorage.setItem("theme", prefersDark ? "true" : "false")
        }
      }
      setIsLoading(false)
    }
    initializeTheme()
  }, [])

  // Add listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      // Only apply if user hasn't set a preference
      if (localStorage.getItem("theme") === null) {
        setThemeState(e.matches)
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Check authentication status and periodically validate it
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/status`, {
          credentials: "include", // Important for sending cookies
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (res.ok) {
          const userData = await res.json()

          // Store user data in state
          setUser(userData)
        } else {
          // Handle unauthenticated state
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication status:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial check
    checkAuthStatus()

    // Set up periodic authentication validation
    // This helps ensure the session is still valid and user is authenticated
    const authCheckInterval = setInterval(checkAuthStatus, 15 * 60 * 1000) // Check every 15 minutes

    return () => clearInterval(authCheckInterval)
  }, [])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme ? "true" : "false")

    // Apply theme class to <html> dynamically
    document.documentElement.classList.toggle("dark", newTheme)
  }

  const setIsMinimizedState = (state) => {
    setIsMinimized(state)
    localStorage.setItem("isMinimized", JSON.stringify(state))
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        user,
        setUser,
        isAuthenticated,
        isMinimized,
        setIsMinimized: setIsMinimizedState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

