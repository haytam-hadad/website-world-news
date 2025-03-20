"use client"

import { useState, useEffect } from "react"
import Article from "@/components/Article"
import { ChevronDown, User, Calendar } from "lucide-react"
import Image from "next/image"

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

// Fake function to fetch profiles
async function fetchProfileResults(query) {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock profile data
    return [
      {
        id: 1,
        name: "Jane Smith",
        role: "Environmental Correspondent",
        bio: `Expert on ${query} and related topics. Award-winning journalist covering climate change and environmental policy.`,
        followers: 12500,
        articles: 342,
        avatarUrl: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Mark Johnson",
        role: "Technology Editor",
        bio: `Covering the intersection of ${query}, technology, society, and policy.`,
        followers: 8700,
        articles: 215,
        avatarUrl: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: `${query} Expert`,
        role: "Special Correspondent",
        bio: `Leading authority on ${query} with over 10 years of experience in journalism.`,
        followers: 15200,
        articles: 427,
        avatarUrl: "/placeholder.svg?height=100&width=100",
      },
    ]
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
    <div className="container mx-auto px-1">
      <h2 className="text-2xl font-bold p-3 text-primary dark:text-primary">
        {isLoading ? (
          <>Searching for &quot;{query}&quot;...</>
        ) : (
          <>
            Search Results for &quot;{query}&quot;
            <ChevronDown className="ml-1 inline-block" />
          </>
        )}
      </h2>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 font-medium text-sm flex-1 max-w-[200px] text-center transition-colors duration-200 ${
            activeTab === "posts"
              ? "border-b-2 border-mainColor text-primary"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("profiles")}
          className={`px-4 py-2 font-medium text-sm flex-1 max-w-[200px] text-center transition-colors duration-200 ${
            activeTab === "profiles"
              ? "border-b-2 border-mainColor text-primary"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Profiles
        </button>
      </div>

      {/* Posts Tab Content */}
      <main className={`${activeTab !== "posts" ? "hidden" : ""}`}>
        <div className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-4">
          {isLoading ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-32 mb-2"></div>
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-48"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              No articles found matching your search. Try different keywords.
            </div>
          ) : (
            articles.map((article) => {
              // Format the data to match what Article component expects
              const formattedArticle = {
                _id: article._id,
                title: article.title || "No title available",
                content: article.content || "No content available",
                imageUrl: article.imageUrl || "/placeholder.svg",
                author: article.authordisplayname || article.authorusername || "Unknown",
                publishedAt: article.publishedAt,
                category: article.category || "General",
                comments: [], // Add empty comments array if your Article component expects it
              }

              return <Article key={article._id} articleData={formattedArticle} />
            })
          )}
        </div>
      </main>

      {/* Profiles Tab Content */}
      <main className={`${activeTab !== "profiles" ? "hidden" : ""}`}>
        <div className="flex flex-wrap justify-center sm:justify-start md:justify-around gap-4">
          {isLoading ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-32 mb-2"></div>
              <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-6 w-48"></div>
            </div>
          ) : profiles.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
              No profiles found matching your search. Try different keywords.
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex flex-row items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-primary/20">
                      <Image
                        src={profile.avatarUrl || "/placeholder.svg"}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                        width={100}
                        height={100}
                      />
                      {/* Fallback if image fails to load */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-gray-800/50 text-white font-bold">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{profile.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{profile.role}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-primary/70" />
                      <span>{profile.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <span>{profile.articles} articles</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

