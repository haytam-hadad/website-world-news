"use client"

import { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"
import { ThemeContext } from "../../ThemeProvider"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Clock,
  FileText,
  AlertCircle,
  Search,
  Eye,
  Calendar,
  Loader2,
  Trash2,
  XCircle,
  MessageSquare,
  MoreVertical,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format date with time
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (e) {
    return "Invalid date"
  }
}

// Calculate time ago
const calculateTimeAgo = (dateString) => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(dateString)
}

// Truncate text
const truncateText = (text, maxLength = 100) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Format content with markdown-like styling
const formatContent = (text) => {
  if (!text) return null

  // Process text line by line to handle headings and blockquotes
  const lines = text.split("\n")

  return (
    <>
      {lines.map((line, lineIndex) => {
        // Skip empty lines but preserve the space
        if (!line.trim()) {
          return <br key={`br-${lineIndex}`} />
        }

        // Handle headings
        if (line.startsWith("# ")) {
          return (
            <h1 key={`line-${lineIndex}`} className="text-2xl font-bold my-4 text-gray-900 dark:text-white">
              {processInlineFormatting(line.substring(2))}
            </h1>
          )
        }

        if (line.startsWith("## ")) {
          return (
            <h2 key={`line-${lineIndex}`} className="text-xl font-bold my-3 text-gray-900 dark:text-white">
              {processInlineFormatting(line.substring(3))}
            </h2>
          )
        }

        if (line.startsWith("### ")) {
          return (
            <h3 key={`line-${lineIndex}`} className="text-lg font-bold my-2 text-gray-900 dark:text-white">
              {processInlineFormatting(line.substring(4))}
            </h3>
          )
        }

        // Handle blockquotes
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={`line-${lineIndex}`}
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 rounded-r-md italic text-gray-700 dark:text-gray-300"
            >
              {processInlineFormatting(line.substring(2))}
            </blockquote>
          )
        }

        // Regular paragraph
        return (
          <p key={`line-${lineIndex}`} className="my-2 text-gray-700 dark:text-gray-300">
            {processInlineFormatting(line)}
          </p>
        )
      })}
    </>
  )
}

// Helper function to process inline formatting
const processInlineFormatting = (text) => {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|__[^_]+__)/).map((chunk, index) => {
    switch (true) {
      case chunk.startsWith("**") && chunk.endsWith("**"):
        return (
          <span key={index} className="font-bold">
            {chunk.slice(2, -2)}
          </span>
        )
      case chunk.startsWith("*") && chunk.endsWith("*"):
        return (
          <span key={index} className="italic">
            {chunk.slice(1, -1)}
          </span>
        )
      case chunk.startsWith("~~") && chunk.endsWith("~~"):
        return (
          <span key={index} className="line-through">
            {chunk.slice(2, -2)}
          </span>
        )
      case chunk.startsWith("__") && chunk.endsWith("__"):
        return (
          <span key={index} className="underline">
            {chunk.slice(2, -2)}
          </span>
        )
      case chunk.startsWith("`") && chunk.endsWith("`"):
        return (
          <code key={index} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-md font-mono">
            {chunk.slice(1, -1)}
          </code>
        )
      default:
        return chunk
    }
  })
}

export default function OngoingArticles() {
  const { user } = useContext(ThemeContext)
  const router = useRouter()

  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDropdown, setShowDropdown] = useState(null)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [viewArticle, setViewArticle] = useState(null)
  const [activeTab, setActiveTab] = useState("content")

  const getYouTubeID = (url) => {
    if (!url) return null

    // Handle different YouTube URL formats
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^&\s]+)$/
    const match = url.match(regExp)
    return match ? match[1] : null
  }
  // Fetch ongoing articles
  useEffect(() => {
    const fetchOngoingArticles = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/ongoing`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ongoing articles: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch ongoing articles")
        }
        console.log(data.data)

        setArticles(data.data || [])
        setFilteredArticles(data.data || [])
      } catch (err) {
        console.error("Error fetching ongoing articles:", err)
        setError(err.message || "Failed to load your ongoing articles")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOngoingArticles()
  }, [user, router])

  // Handle search and filtering
  useEffect(() => {
    if (articles.length === 0) return

    let filtered = [...articles]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          (article.title && article.title.toLowerCase().includes(query)) ||
          (article.content && article.content.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt)
      const dateB = new Date(b.updatedAt || b.createdAt)

      if (sortOrder === "newest") {
        return dateB - dateA
      } else if (sortOrder === "oldest") {
        return dateA - dateB
      } else if (sortOrder === "title-asc") {
        return (a.title || "").localeCompare(b.title || "")
      } else if (sortOrder === "title-desc") {
        return (b.title || "").localeCompare(a.title || "")
      }

      return 0
    })

    setFilteredArticles(filtered)
  }, [articles, searchQuery, sortOrder])

  // Handle article deletion
  const handleDeleteArticle = async (articleId) => {
    try {
      setIsDeleting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete article")
      }

      // Remove the deleted article from the state
      setArticles((prevArticles) => prevArticles.filter((article) => article._id !== articleId))
      setShowDeleteDialog(false)
      setSelectedArticle(null)
      setViewArticle(null)
    } catch (err) {
      console.error("Error deleting article:", err)
      alert(err.message || "An error occurred while deleting the article")
    } finally {
      setIsDeleting(false)
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null)
      setShowSortDropdown(false)
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 ml-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 py-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-2 mb-10 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ongoing Articles</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Articles that are pending approval or need further editing
          </p>
        </div>

        <Link href="/add">
          <Button className="bg-mainColor hover:bg-mainColor/90">
            <FileText className="mr-2 h-4 w-4" />
            Create New Article
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-mainColor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No ongoing articles</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? "No articles match your search criteria. Try a different search term."
              : "You don't have any articles in progress. Create a new article to get started."}
          </p>
          <Link href="/add">
            <Button className="bg-mainColor hover:bg-mainColor/90">
              <FileText className="mr-2 h-4 w-4" />
              Create New Article
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Approval
                  </div>
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDropdown(showDropdown === article._id ? null : article._id)
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {showDropdown === article._id && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          onClick={() => {
                            setViewArticle(article)
                            setActiveTab("content")
                            setShowDropdown(null)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Article</span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                          onClick={() => {
                            setSelectedArticle(article)
                            setShowDeleteDialog(true)
                            setShowDropdown(null)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-2 line-clamp-2 text-gray-900 dark:text-white">
                  {article.title || "Untitled Article"}
                </h3>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {calculateTimeAgo(article.updatedAt || article.createdAt)}
                </div>
              </div>
              <div className="px-4 pb-3">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {truncateText(article.content || article.description || "No content available", 150)}
                </p>
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 capitalize">
                  {article.category || "Uncategorized"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewArticle(article)
                    setActiveTab("content")
                  }}
                >
                  <Eye className="mr-2 h-3 w-3" />
                  View Article
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Article Modal */}
      {viewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewArticle(null)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[80%]">
                {viewArticle.title || "Untitled Article"}
              </h2>
              <button
                onClick={() => setViewArticle(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 capitalize">
                  {viewArticle.category || "Uncategorized"}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending Approval
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {formatDateTime(viewArticle.updatedAt || viewArticle.createdAt)}
                </span>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`px-4 py-2 ${activeTab === "content" ? "border-b-2 border-mainColor text-mainColor font-medium" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setActiveTab("content")}
                  >
                    Content
                  </button>
                  <button
                    className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-mainColor text-mainColor font-medium" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                </div>
              </div>

              {activeTab === "content" ? (
                <>
                  {viewArticle.mediaUrl && viewArticle.mediaType == "video" ? (
                    <div className="rounded-md overflow-hidden mb-4 max-w-md mx-auto">
                      <iframe
                        width="100%"
                        height="250"
                        src={`https://www.youtube.com/embed/${getYouTubeID(viewArticle.mediaUrl)}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    viewArticle.mediaUrl && (
                      <div className="rounded-md overflow-hidden mb-4">
                        <Image
                          src={viewArticle.mediaUrl || "/placeholder.svg"}
                          alt={viewArticle.title || "Article image"}
                          width={800}
                          height={450}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )
                  )}

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {formatContent(viewArticle.content)}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                      <p className="text-gray-900 dark:text-white">{formatDateTime(viewArticle.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                      <p className="text-gray-900 dark:text-white">{formatDateTime(viewArticle.updatedAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Author</h3>
                      <p className="text-gray-900 dark:text-white">
                        {viewArticle.authorId?.displayname || viewArticle.authorusername || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {viewArticle.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending Approval
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedArticle(viewArticle)
                    setShowDeleteDialog(true)
                    setViewArticle(null)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setViewArticle(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog using shadcn/ui Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedArticle && (
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {selectedArticle.title || "Untitled Article"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {truncateText(selectedArticle.content || "No content", 100)}
              </p>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedArticle && handleDeleteArticle(selectedArticle._id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
