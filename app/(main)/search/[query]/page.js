"use client"

import { useState, useEffect, useContext } from "react"
import Article from "@/components/Article"
import { ChevronDown } from "lucide-react"
import ProfileCard from "@/components/profile-card"
import { ThemeContext } from "../../../ThemeProvider" // Import ThemeContext to access current user

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

export default function Search({ params }) {
  const query = decodeURIComponent(params.query)
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary flex items-center">
        {isLoading ? (
          <>Searching for &quot;{query}&quot;...</>
        ) : (
          <>
            Search Results for &quot;{query}&quot;
            <ChevronDown className="ml-2 h-5 w-5" />
          </>
        )}
      </h2>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-6 py-3 font-medium text-sm flex-1 max-w-[200px] text-center transition-all duration-300 ${
            activeTab === "posts"
              ? "border-b-4 border-mainColor text-primary font-semibold"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("profiles")}
          className={`px-6 py-3 font-medium text-sm flex-1 max-w-[200px] text-center transition-all duration-300 ${
            activeTab === "profiles"
              ? "border-b-4 border-mainColor text-primary font-semibold"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Profiles
        </button>
      </div>

      {/* Posts Tab Content */}
      <main className={`${activeTab !== "posts" ? "hidden" : ""}`}>
        <div className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-6">
          {isLoading ? (
            <div className="w-full text-center py-12">
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-32 mb-2"></div>
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-48"></div>
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
      </main>

      {/* Profiles Tab Content */}
      <main className={`${activeTab !== "profiles" ? "hidden" : ""}`}>
        <div className="flex flex-col space-y-6 w-full max-w-3xl mx-auto">
          {isLoading ? (
            <div className="w-full text-center py-12">
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-32 mb-2"></div>
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-48"></div>
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
      </main>
    </div>
  )
}

