"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeContext } from "../app/ThemeProvider"

import {
  EyeOff,
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Clock,
  Eye,
  AlertCircle,
  ShieldCheck,
} from "lucide-react"

import SourcesDisplay from "./sources-display"
import CommentSection from "./comment-section"
import ReportModal from "./report-modal"

// Function to determine rating color based on score
const getRatingColor = (rating) => {
  if (rating >= 80) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
  if (rating >= 60) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
  if (rating >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
  if (rating >= 20) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
}

const SinglePost = ({ post, initialComments = [] }) => {
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post?.upvote || 0)
  const [downvoteCount, setDownvoteCount] = useState(post?.downvote || 0)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [actionTaken, setActionTaken] = useState(null) // 'hide' or 'report'
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const optionsRef = useRef(null)
  const router = useRouter()
  const { user } = useContext(ThemeContext)

  // Initialize vote state based on user's previous votes
  useEffect(() => {
    if (post && user) {
      // Check if user has already voted on this post
      if (post.userUpvote && post.userUpvote.includes(user.username)) {
        setUserLiked(true)
      } else if (post.userDownvote && post.userDownvote.includes(user.username)) {
        setUserDisliked(true)
      }

      // Initialize counts
      setUpvoteCount(post.upvote || 0)
      setDownvoteCount(post.downvote || 0)
    }
  }, [post, user])

  // Add this useEffect to check if the post is saved when the component loads
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!user || !post._id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/save-status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setIsSaved(data.saved)
        }
      } catch (error) {
        console.error("Error checking save status:", error)
      }
    }

    checkSaveStatus()
  }, [post._id, user])

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleUpvote = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (isVoting) return // Prevent multiple clicks

    try {
      setIsVoting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upvote")
      }

      const data = await response.json()

      // Update UI based on response
      setUpvoteCount(data.upvote)
      setDownvoteCount(data.downvote)
      setUserLiked(data.userLiked)
      setUserDisliked(data.userDisliked)
    } catch (error) {
      console.error("Error upvoting article:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleDownvote = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (isVoting) return // Prevent multiple clicks

    try {
      setIsVoting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/downvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to downvote")
      }

      const data = await response.json()

      // Update UI based on response
      setUpvoteCount(data.upvote)
      setDownvoteCount(data.downvote)
      setUserLiked(data.userLiked)
      setUserDisliked(data.userDisliked)
    } catch (error) {
      console.error("Error downvoting article:", error)
    } finally {
      setIsVoting(false)
    }
  }

  const toggleSave = async (e) => {
    e.preventDefault()

    if (!user) {
      router.push("/login")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setIsSaved(data.saved)
      } else {
        const errorData = await response.json()
        console.error("Error saving article:", errorData)
        alert(errorData.message || "Failed to save article. Please try again.")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      alert("An error occurred while saving the article. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.description || post.content?.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing", err))
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          console.log("Link copied to clipboard")
        })
        .catch((err) => console.error("Error copying link", err))
    }
  }

  const handleHidePost = (e) => {
    e.stopPropagation()
    setActionTaken("hide")
    setIsMinimized(true)
    setShowOptions(false)
    // Here you would implement the actual hide functionality with an API call
  }

  const handleReportClick = (e) => {
    e.stopPropagation()
    setShowOptions(false)
    setShowReportModal(true)
  }

  const handleReportSuccess = () => {
    setActionTaken("report")
    setIsMinimized(true)
  }

  const handleUndoAction = (e) => {
    e.stopPropagation()
    // Don't allow undoing a delete
    if (actionTaken === "delete") return

    setIsMinimized(false)
    setActionTaken(null)
    // Here you would implement the actual undo functionality with an API call
  }

  const handleDeleteArticle = async (e) => {
    e.stopPropagation()

    try {
      setIsDeleting(true)
      setShowOptions(false)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      })

      if (response.ok) {
        // Show success message
        setActionTaken("delete")
        setIsMinimized(true)

        // Redirect to home after a short delay
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error("Error deleting article:", errorData)
        alert(errorData.message || "Failed to delete article. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      alert("An error occurred while deleting the article. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  // Calculate time ago
  const calculateTimeAgo = (publishedAt) => {
    if (!publishedAt) return "N/A"

    const publishedDate = new Date(publishedAt?.$date || publishedAt)

    // Check if the date is valid
    if (isNaN(publishedDate.getTime())) return "N/A"

    const now = new Date()
    const diffInSeconds = Math.floor((now - publishedDate) / 1000)

    // Handle different time intervals
    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  // Display media (image or video)
  const displayMedia = () => {
    if (!post.mediaUrl) return null

    if (post.mediaType === "image") {
      return (
        <div className="w-full relative overflow-hidden rounded-lg mb-4">
          <div className="w-full aspect-[16/9] relative bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {!mediaLoaded && !mediaError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              className={`object-cover transition-opacity duration-300 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
              src={post.mediaUrl || "/placeholder.svg"}
              alt={post.title || "Article image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
              onLoad={() => setMediaLoaded(true)}
              onError={(e) => {
                setMediaError(true)
                setMediaLoaded(true)
                e.target.src = "/placeholder.svg"
              }}
            />
          </div>
        </div>
      )
    } else if (post.mediaType === "video") {
      const youtubeID = getYouTubeID(post.mediaUrl)

      return (
        <div className="w-full relative overflow-hidden rounded-lg mb-6">
          <div className="w-full aspect-[16/9] relative bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {youtubeID ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeID}`}
                title={post.title || "Video"}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setMediaLoaded(true)}
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                Video not available
              </div>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  // Extract YouTube ID from URL
  const getYouTubeID = (url) => {
    if (!url) return null

    // Handle different YouTube URL formats
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
    const match = url.match(regExp)
    return match ? match[1] : null
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
                className="border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 rounded-r-md italic text-gray-700 dark:text-gray-300"
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
            <span key={index} className="underline">
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
            <span key={index} className="italic">
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

  // Render minimized view
  if (isMinimized) {
    let actionIcon = <EyeOff className="w-5 h-5" />
    let actionText = "Post hidden"

    if (actionTaken === "report") {
      actionIcon = <AlertCircle className="w-5 h-5" />
      actionText = "Post reported"
    } else if (actionTaken === "delete") {
      actionIcon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      )
      actionText = "Article deleted successfully"
    }

    return (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full my-2 max-w-3xl mx-auto"
      >
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            {actionIcon}
            <span>{actionText}</span>
          </div>
          {actionTaken !== "delete" && (
            <button
              onClick={handleUndoAction}
              className="text-mainColor hover:text-mainColor/80 transition-colors flex items-center space-x-1"
              aria-label="Undo action"
            >
              <span>Undo</span>
            </button>
          )}
        </div>
      </motion.article>
    )
  }

  // If post is not available yet
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-4 mt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-1">
        <article className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Header with user info */}
          <div className="p-2 sm:p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <Link
              href={`/profile/${post.authorId?.username || post.authorusername || "unknown"}`}
              className="flex items-center space-x-2 group"
            >
              {post.authorId?.profilePicture ? (
                <div className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src={post.authorId.profilePicture || "/placeholder.svg"}
                    alt={post.authorId?.displayname || "Unknown"}
                    width="60"
                    height="60"
                    className="h-full w-full object-cover"
                    />
                </div>
              ) : (
                <div className="rounded-full bg-mainColor w-10 h-10 flex items-center justify-center text-white font-semibold text-lg cursor-pointer group-hover:shadow-md transition-shadow">
                  {post.authorId?.displayname ? post.authorId.displayname[0].toUpperCase() : "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize group-hover:underline">
                  {post.authorId?.displayname || "Unknown"}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.authorId?.username
                      ? `@${post.authorId.username}`
                      : post.authorusername
                        ? `@${post.authorusername}`
                        : "N/A"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <time dateTime={post.publishedAt}>{calculateTimeAgo(post.publishedAt)}</time>
                  </span>
                </div>
              </div>
            </Link>

            {/* Options button */}
            <div className="relative" ref={optionsRef}>
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                onClick={() => setShowOptions(!showOptions)}
                aria-label="More options"
                aria-expanded={showOptions}
                aria-haspopup="true"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user && user.username === (post.authorId?.username || post.authorusername) ? (
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        onClick={handleDeleteArticle}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        <span>Delete article</span>
                      </button>
                    ) : (
                      <>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          onClick={handleHidePost}
                        >
                          <EyeOff className="w-4 h-4" />
                          <span>Hide this post</span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          onClick={handleReportClick}
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>Report this post</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category and Rating */}
          <div className="px-4 py-2 flex items-center space-x-2">
            <Link href={`/category/${post.category?.toLowerCase() || "general"}`}>
              <div className="px-3 py-1 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full capitalize hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                {post.category || "General"}
              </div>
            </Link>

            {/* Numerical Rating Display */}
            {post.rating !== undefined && post.rating !== 0 ? (
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getRatingColor(post.rating)}`}
                title="Article trustworthiness rating"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>{Math.round(post.rating)}%</span>
              </div>
            ) : post.rating === 0 ? (
              <div
                className="px-2 py-1 text-xs font-medium rounded-full flex items-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                title="Rating needs calculation"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Pending</span>
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="p-2 sm:p-4">
            {/* Title */}
            <h1 className="font-serif font-bold text-2xl m-2 sm:text-3xl text-gray-900 dark:text-gray-100 mb-10">
              {post.title}
            </h1>

            {/* Media */}
            {displayMedia()}

            {/* Content */}
            <div className="prose prose-sm sm:prose break-words max-w-none dark:prose-invert">
              {formatContent(post.content)}
              {/* Sources section */}
              {post.sources && post.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <SourcesDisplay sources={post.sources} />
                </div>
              )}
            </div>

            {/* Post stats */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <ArrowBigUp className={`w-4 h-4 mr-1 ${userLiked ? "text-green-500 dark:text-green-400" : ""}`} />
                  {upvoteCount}
                </span>
                <span className="flex items-center">
                  <ArrowBigDown className={`w-4 h-4 mr-1 ${userDisliked ? "text-red-500 dark:text-red-400" : ""}`} />
                  {downvoteCount}
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {initialComments.length || 0}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {post.views || 0}
                </span>
              </div>

              {/* Save button */}
              <button
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? "text-yellow-500 dark:text-yellow-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                }`}
                onClick={toggleSave}
                disabled={isSaving}
                aria-label={isSaved ? "Unsave article" : "Save article"}
                aria-pressed={isSaved}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700">
            <button
              className={`py-3 flex items-center justify-center space-x-2 transition-colors ${
                userLiked
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={handleUpvote}
              disabled={isVoting}
              aria-label="Upvote"
              aria-pressed={userLiked}
            >
              <ArrowBigUp className="w-5 h-5" />
              <span className="font-medium">Upvote</span>
            </button>

            <button
              className={`py-3 flex items-center justify-center space-x-2 transition-colors ${
                userDisliked
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={handleDownvote}
              disabled={isVoting}
              aria-label="Downvote"
              aria-pressed={userDisliked}
            >
              <ArrowBigDown className="w-5 h-5" />
              <span className="font-medium">Downvote</span>
            </button>

            <button
              className="py-3 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </article>

        {/* Comments section */}
        <CommentSection
          postId={post._id}
          initialComments={initialComments}
          postAuthorUsername={post.authorId?.username || post.authorusername}
        />
      </div>

      {/* Report Modal */}
      <ReportModal
        articleId={post._id}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={handleReportSuccess}
      />
    </>
  )
}

export default SinglePost

