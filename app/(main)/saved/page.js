"use client"

import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "@/app/ThemeProvider"
import { useRouter } from "next/navigation"
import Article from "@/components/Article"
import { Loader2, BookmarkX, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SavedArticlesPage() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(ThemeContext)
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push("/login")
      return
    }

    const fetchSavedArticles = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/saved/list`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch saved articles: ${response.status}`)
        }

        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error("Error fetching saved articles:", error)
        setError(error.message || "Failed to load your saved articles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedArticles()
  }, [user, router])

  // Function to handle when an article is unsaved
  const handleArticleUnsaved = (articleId) => {
    setArticles(articles.filter((article) => article._id !== articleId))
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto p-1 sm:p-3">
      <h1 className="text-xl md:text-2xl font-bold mb-6 p-3">Your Saved Articles</h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-mainColor animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading saved articles...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 dark:text-red-300 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <BookmarkX className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No saved articles</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            You haven&apos;t saved any articles yet. Browse articles and click the bookmark icon to save them for later.
          </p>
          <Link
            href="/"
            className="mt-4 px-4 py-2 bg-mainColor text-white rounded-md hover:bg-mainColor/90 transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <Article key={article._id} articleData={article} onUnsave={handleArticleUnsaved} />
          ))}
        </div>
      )}
    </div>
  )
}

