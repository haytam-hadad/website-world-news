"use client"

import { useState, useEffect } from "react"
import { TrendingUpIcon as Trending, ArrowRight } from "lucide-react"
import Article from "@/components/Article"

// Fetch the latest articles from the API
async function fetchTrendingArticles() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/latest`
    console.log("Fetching trending articles from:", apiUrl)

    const res = await fetch(apiUrl, {
      cache: "no-store",
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      console.log(`Error response: ${res.status}`)
      throw new Error(`Failed to fetch trending articles: ${res.status}`)
    }

    const data = await res.json()
    console.log(`Received ${Array.isArray(data) ? data.length : 0} trending articles`)

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching trending articles:", error)
    return []
  }
}

export default function TrendsPage() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function loadArticles() {
      try {
        setIsLoading(true)
        const data = await fetchTrendingArticles()
        setArticles(data)

        // Extract unique categories from articles
        const uniqueCategories = ["all", ...new Set(data.map((article) => article.category || "Uncategorized"))]
        setCategories(uniqueCategories)

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading trending articles:", err)
        setError(err)
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  // Filter articles based on active category
  const filteredArticles =
    activeCategory === "all"
      ? articles
      : articles.filter((article) => (article.category || "Uncategorized") === activeCategory)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/20">
            <Trending className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            We couldn&apos;t load the trending articles. This could be due to a network issue or a problem with our servers.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            <ArrowRight className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-1">
      <div className="flex items-center gap-2 p-3 mb-2">
        <Trending className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-primary dark:text-primary">Trending Now</h1>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-1 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-primary rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category === "all" ? "All Trends" : category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <Trending className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-lg font-medium">No trending articles available</p>
          <p className="text-sm mt-2">
            {activeCategory === "all"
              ? "Please check back later for the latest trends"
              : `No articles found in the "${activeCategory}" category`}
          </p>
        </div>
      ) : (
        <div className="flex-col gap-5">
          {filteredArticles.map((article) => (
            <Article
              key={article._id}
              articleData={{
                _id: article._id,
                title: article.title || "No title available",
                content: article.content || "No content available",
                imageUrl: article.imageUrl || "/placeholder.svg",
                author: article.authordisplayname || article.authorusername || "Unknown",
                publishedAt: article.publishedAt,
                category: article.category || "General",
                comments: [],
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Loading state component
function LoadingState() {
  return (
    <>
      {/* Category Tabs Skeleton */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ))}
      </div>

      {/* Articles Grid Skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mb-4 animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((article) => (
            <div
              key={article}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4 animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

