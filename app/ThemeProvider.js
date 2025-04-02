"use client"
import { createContext, useState, useEffect } from "react"

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setThemeState] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme !== null ? JSON.parse(savedTheme) : false
  })
  const [user, setUser] = useState(null)
  const [isMinimized, setIsMinimized] = useState(() => {
    const savedState = localStorage.getItem("isMinimized")
    return savedState !== null ? JSON.parse(savedState) : false
  })

  useEffect(() => {
    const initializeTheme = async () => {
      if (typeof window !== "undefined") {
        if (theme) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
      setIsLoading(false)
    }
    initializeTheme()
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      if (localStorage.getItem("theme") === null) {
        setThemeState(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

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

          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking authentication status:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    const authCheckInterval = setInterval(checkAuthStatus, 15 * 60 * 1000) // Check every 15 minutes

    return () => clearInterval(authCheckInterval)
  }, [])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", JSON.stringify(newTheme))
    document.documentElement.classList.toggle("dark", newTheme)
  }

  const setIsMinimizedState = (state) => {
    setIsMinimized(state)
    localStorage.setItem("isMinimized", JSON.stringify(state))
  }

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

