"use client"

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import Article from "@/components/Article"
import { SearchIcon } from "lucide-react"
import ProfileCard from "@/components/profile-card"
import { ThemeContext } from "./../app/ThemeProvider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Keep the existing fetch function for articles
async function fetchSearchResults(query) {
  try {
    if (!query) return []

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/search/${encodeURIComponent(query)}`
    console.log("Fetching search results from:", apiUrl)

    const res = await fetch(apiUrl, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.log(`Error response: ${res.status}`)
      return []
    }

    const data = await res.json()
    console.log(`Received ${Array.isArray(data) ? data.length : 0} search results`)

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching search results:", error)
    return []
  }
}

// Real function to fetch profiles from the API
async function fetchProfileResults(query) {
  try {
    if (!query) return []

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/search/${encodeURIComponent(query)}`
    console.log("Fetching profile results from:", apiUrl)

    const res = await fetch(apiUrl, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.log(`Error response: ${res.status}`)
      return []
    }

    const data = await res.json()
    console.log(`Received ${data.users ? data.users.length : 0} profile results`)

    return data.users || []
  } catch (error) {
    console.error("Error fetching profile results:", error)
    return []
  }
}

export default function Search({ query }) {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState(query)
  const [activeTab, setActiveTab] = useState("posts")
  const [articles, setArticles] = useState([])
  const [profiles, setProfiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(ThemeContext) // Get current logged-in user

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      // Load articles
      const articlesData = await fetchSearchResults(query)
      setArticles(articlesData)

      // Load profiles (only if profiles tab is active or if we want to preload)
      if (activeTab === "profiles") {
        const profilesData = await fetchProfileResults(query)
        setProfiles(profilesData)
      }

      setIsLoading(false)
    }

    loadData()
    // Update search input when query changes
    setSearchInput(query)
  }, [query])

  // Load profiles when switching to profiles tab if not already loaded
  useEffect(() => {
    async function loadProfiles() {
      if (activeTab === "profiles" && profiles.length === 0) {
        setIsLoading(true)
        const profilesData = await fetchProfileResults(query)
        setProfiles(profilesData)
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [activeTab, profiles.length, query])

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`)
    }
  }

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <div className="container mx-auto p-1">
      {/* Search Bar */}
      <div>
        <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center overflow-hidden rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for posts or profiles..."
              className="w-full px-6 py-6 pl-12  bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
              aria-label="Search query"
            />
            <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400 group-hover:text-mainColor transition-colors duration-300" />
            <button
              type="submit"
              className="absolute right-0 h-full px-4 bg-mainColor text-white font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center"
              aria-label="Submit search"
            >
              <span className="mr-2 hidden sm:inline">Search</span>
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Tabs using shadcn/ui */}
      <Tabs defaultValue="posts" value={activeTab} onValueChange={handleTabChange} className="mt-5 w-full">
        <TabsList className="grid text-mainColor w-full grid-cols-2 mx-auto mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
        </TabsList>

        {/* Posts Tab Content */}
        <TabsContent value="posts">
          <div className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-6">
            {isLoading ? (
              <div className="w-full text-center py-12">
                <div className="animate-pulse inline-block h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500 dark:text-gray-400">
                No articles found matching your search. Try different keywords.
              </div>
            ) : (
              articles.map((article) => {
                return <Article key={article._id} articleData={article} />
              })
            )}
          </div>
        </TabsContent>

        {/* Profiles Tab Content */}
        <TabsContent value="profiles">
          <div className="flex flex-col w-full mx-auto">
            {isLoading ? (
              <div className="w-full text-center py-12">
                <div className="animate-pulse inline-block h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : profiles.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500 dark:text-gray-400">
                No profiles found matching your search. Try different keywords.
              </div>
            ) : (
              profiles.map((profile) => (
                <ProfileCard key={profile.id || profile._id} profile={profile} currentUser={user} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

