"use client"
import { createContext, useState, useEffect } from "react"
import {
  Globe,
  Building,
  ShieldAlert,
  Briefcase,
  TestTube,
  Shield,
  DollarSign,
  MapPin,
  CheckSquare,
  SearchIcon,
  Heart,
  CalendarDays,
  Trophy,
  Flame,
  PenTool,
  Film,
  Theater,
  Star,
  HeartPulse,
  Leaf,
  Laptop,
  GraduationCap,
  Rocket,
  Plane,
  TrendingUp,
  FolderIcon,
} from "lucide-react"

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setThemeState] = useState(false)
  const [user, setUser] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [topCategories, setTopCategories] = useState([])

  // Define categories with icons and metadata
  const categories = [
    // Group 1: Trusted News
    {
      id: "world",
      name: "World",
      icon: <Globe className="w-4 h-4" />,
      description: "Global news and international affairs",
      color: "bg-blue-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: true,
    },
    {
      id: "politics",
      name: "Politics",
      icon: <Building className="w-4 h-4" />,
      description: "Political developments, policy changes, and governance",
      color: "bg-red-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: true,
    },
    {
      id: "crime",
      name: "Crime",
      icon: <ShieldAlert className="w-4 h-4" />,
      description: "Crime reports, legal cases, and law enforcement",
      color: "bg-gray-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: false,
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Business news, market trends, and corporate updates",
      color: "bg-amber-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: true,
    },
    {
      id: "science",
      name: "Science",
      icon: <TestTube className="w-4 h-4" />,
      description: "Scientific discoveries, research, and innovations",
      color: "bg-indigo-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: true,
    },
    {
      id: "defense",
      name: "Defense",
      icon: <Shield className="w-4 h-4" />,
      description: "Military news, defense technology, and security",
      color: "bg-green-700",
      type: "trusted-news",
      group: "Trusted News",
      featured: false,
    },
    {
      id: "economy",
      name: "Economy",
      icon: <DollarSign className="w-4 h-4" />,
      description: "Economic trends, financial news, and market analysis",
      color: "bg-emerald-500",
      type: "trusted-news",
      group: "Trusted News",
      featured: false,
    },

    // Group 2: Community Reports
    {
      id: "local",
      name: "Local",
      icon: <MapPin className="w-4 h-4" />,
      description: "News and events from your local community",
      color: "bg-orange-500",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },
    {
      id: "facts",
      name: "Facts",
      icon: <CheckSquare className="w-4 h-4" />,
      description: "Fact-checking and verification of news",
      color: "bg-green-500",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },
    {
      id: "investigations",
      name: "Investigations",
      icon: <SearchIcon className="w-4 h-4" />,
      description: "Investigative journalism and in-depth reports",
      color: "bg-purple-500",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },
    {
      id: "humans",
      name: "Humans",
      icon: <Heart className="w-4 h-4" />,
      description: "Personal stories and human interest pieces",
      color: "bg-pink-500",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },
    {
      id: "jobs",
      name: "Jobs",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Career news, job opportunities, and workplace trends",
      color: "bg-blue-600",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },
    {
      id: "events",
      name: "Events",
      icon: <CalendarDays className="w-4 h-4" />,
      description: "Upcoming events, conferences, and gatherings",
      color: "bg-teal-500",
      type: "community-reports",
      group: "Community Reports",
      featured: false,
    },

    // Group 3: Discussions
    {
      id: "sports",
      name: "Sports",
      icon: <Trophy className="w-4 h-4" />,
      description: "Sports news, results, and athlete stories",
      color: "bg-green-600",
      type: "discussions",
      group: "Discussions",
      featured: true,
    },
    {
      id: "trending",
      name: "Trending",
      icon: <Flame className="w-4 h-4" />,
      description: "Hot topics and viral content",
      color: "bg-red-600",
      type: "discussions",
      group: "Discussions",
      featured: false,
    },
    {
      id: "opinions",
      name: "Opinions",
      icon: <PenTool className="w-4 h-4" />,
      description: "Opinion pieces, editorials, and commentary",
      color: "bg-yellow-500",
      type: "discussions",
      group: "Discussions",
      featured: false,
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Film className="w-4 h-4" />,
      description: "Movies, TV shows, celebrity news, and entertainment",
      color: "bg-pink-600",
      type: "discussions",
      group: "Discussions",
      featured: true,
    },
    {
      id: "culture",
      name: "Culture",
      icon: <Theater className="w-4 h-4" />,
      description: "Arts, culture, and societal trends",
      color: "bg-purple-600",
      type: "discussions",
      group: "Discussions",
      featured: false,
    },
    {
      id: "reviews",
      name: "Reviews",
      icon: <Star className="w-4 h-4" />,
      description: "Product, service, and media reviews",
      color: "bg-amber-600",
      type: "discussions",
      group: "Discussions",
      featured: false,
    },

    // Group 4: General Info
    {
      id: "health",
      name: "Health",
      icon: <HeartPulse className="w-4 h-4" />,
      description: "Health news, medical breakthroughs, and wellness advice",
      color: "bg-red-500",
      type: "general-info",
      group: "General Info",
      featured: true,
    },
    {
      id: "nature",
      name: "Nature",
      icon: <Leaf className="w-4 h-4" />,
      description: "Environmental news, wildlife, and natural phenomena",
      color: "bg-green-500",
      type: "general-info",
      group: "General Info",
      featured: false,
    },
    {
      id: "tech",
      name: "Tech",
      icon: <Laptop className="w-4 h-4" />,
      description: "Technology news, gadgets, and digital innovation",
      color: "bg-blue-500",
      type: "general-info",
      group: "General Info",
      featured: true,
    },
    {
      id: "education",
      name: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
      description: "Educational news, learning resources, and academic insights",
      color: "bg-indigo-500",
      type: "general-info",
      group: "General Info",
      featured: false,
    },
    {
      id: "space",
      name: "Space",
      icon: <Rocket className="w-4 h-4" />,
      description: "Space exploration, astronomy, and cosmic discoveries",
      color: "bg-violet-500",
      type: "general-info",
      group: "General Info",
      featured: false,
    },
    {
      id: "travel",
      name: "Travel",
      icon: <Plane className="w-4 h-4" />,
      description: "Travel destinations, tips, and adventure stories",
      color: "bg-cyan-500",
      type: "general-info",
      group: "General Info",
      featured: false,
    },
  ]

  // Filter types for category filtering
  const filterTypes = [
    { id: "all", name: "All Categories" },
    { id: "trusted-news", name: "Trusted News" },
    { id: "community-reports", name: "Community Reports" },
    { id: "discussions", name: "Discussions" },
    { id: "general-info", name: "General Info" },
  ]

  // Get category icon based on name
  const getCategoryIcon = (categoryName) => {
    const name = typeof categoryName === "string" ? categoryName.toLowerCase() : ""

    // Map category names to appropriate icons
    if (name.includes("tech") || name.includes("technology")) return <Laptop className="w-4 h-4" />
    if (name.includes("health")) return <HeartPulse className="w-4 h-4" />
    if (name.includes("sport")) return <Trophy className="w-4 h-4" />
    if (name.includes("politic")) return <Building className="w-4 h-4" />
    if (name.includes("science")) return <TestTube className="w-4 h-4" />
    if (name.includes("business")) return <Briefcase className="w-4 h-4" />
    if (name.includes("world") || name.includes("global")) return <Globe className="w-4 h-4" />
    if (name.includes("trend")) return <TrendingUp className="w-4 h-4" />
    if (name.includes("entertainment")) return <Film className="w-4 h-4" />
    if (name.includes("education")) return <GraduationCap className="w-4 h-4" />
    if (name.includes("travel")) return <Plane className="w-4 h-4" />
    if (name.includes("nature") || name.includes("environment")) return <Leaf className="w-4 h-4" />

    // Default icon
    return <FolderIcon className="w-4 h-4" />
  }

  // Get category color based on name
  const getCategoryColor = (categoryName) => {
    const name = typeof categoryName === "string" ? categoryName.toLowerCase() : ""

    if (name.includes("tech") || name.includes("technology")) return "bg-blue-500"
    if (name.includes("health")) return "bg-red-500"
    if (name.includes("sport")) return "bg-green-600"
    if (name.includes("politic")) return "bg-red-500"
    if (name.includes("science")) return "bg-indigo-500"
    if (name.includes("business")) return "bg-amber-500"
    if (name.includes("world") || name.includes("global")) return "bg-blue-500"
    if (name.includes("trend")) return "bg-red-600"
    if (name.includes("entertainment")) return "bg-pink-600"
    if (name.includes("education")) return "bg-indigo-500"
    if (name.includes("travel")) return "bg-cyan-500"
    if (name.includes("nature") || name.includes("environment")) return "bg-green-500"

    // Default color
    return "bg-mainColor"
  }

  useEffect(() => {
    const initializeTheme = async () => {
      if (typeof window !== "undefined") {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem("theme")
        const themeValue = savedTheme !== null ? JSON.parse(savedTheme) : false
        setThemeState(themeValue)

        // Apply theme class
        if (themeValue) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }

        // Load minimized state from localStorage
        const savedState = localStorage.getItem("isMinimized")
        const minimizedValue = savedState !== null ? JSON.parse(savedState) : false
        setIsMinimized(minimizedValue)
      }
      setIsLoading(false)
    }
    initializeTheme()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

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

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/topcategories/`)

        if (!response.ok) {
          if (response.status === 404) {
            setTopCategories([])
            return
          }
          throw new Error(`Failed to fetch top categories: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setTopCategories(data)
      } catch (error) {
        console.error("Error fetching top categories:", error)
        setTopCategories([])
      }
    }

    fetchTopCategories()
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
        categories,
        filterTypes,
        topCategories,
        getCategoryIcon,
        getCategoryColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

