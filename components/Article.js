"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, Share2, MessageCircle, MoreHorizontal, Bookmark, BookmarkCheck, Eye, AlertCircle, EyeOff, ArrowBigDown, ChevronRight, ShieldCheck } from 'lucide-react'
import { useState, useRef, useContext, useEffect } from "react"
import { ThemeContext } from "./../app/ThemeProvider"
import { ArrowBigUp } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import ReportModal from "./report-modal"

const formatText = (text) => {
  if (!text) return null

  // Remove heading markers and blockquote markers for preview
  text = text.replace(/^#+\s+/gm, "")
  text = text.replace(/^>\s+/gm, "")

  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|_[^_]+_)/).map((chunk, index) => {
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
      case chunk.startsWith("_") && chunk.endsWith("_"):
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

// Function to determine rating color based on score
const getRatingColor = (rating) => {
  if (rating >= 80) return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
  if (rating >= 60) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
  if (rating >= 40) return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
  if (rating >= 20) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
  return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
}

// Add the onUnsave prop to the Article component
const Article = ({ articleData, onUnsave }) => {
  console.log(articleData)
  // No destructuring, we'll use articleData directly
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [likeCount, setLikeCount] = useState(articleData.upvote || 0)
  const [dislikeCount, setDislikeCount] = useState(articleData.downvote || 0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [actionTaken, setActionTaken] = useState(null) // 'hide' or 'report'
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  const optionsRef = useRef(null)
  const router = useRouter()
  const { user } = useContext(ThemeContext)

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

  const handleClick = () => {
    if (!isMinimized) {
      router.push(`/post/${articleData._id}`)
    }
  }

  // Add this useEffect to check if the article is saved when the component loads
  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!user || !articleData._id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${articleData._id}/save-status`, {
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
  }, [articleData._id, user])

  const toggleSave = async (e) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    if (isSaving) return; // Prevent multiple clicks

    try {
      setIsSaving(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${articleData._id}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.saved);
        
        // If the article was unsaved and we have an onUnsave callback, call it
        if (!data.saved && onUnsave) {
          onUnsave(articleData._id);
        }
      } else {
        const errorData = await response.json();
        console.error("Error saving article:", errorData);
      }
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleShare = (e) => {
    e.stopPropagation()

    if (navigator.share) {
      navigator
        .share({
          title: articleData.title,
          text: articleData.description || articleData.content?.substring(0, 100) + "...",
          url: `/post/${articleData._id}`,
        })
        .catch((err) => console.error("Error sharing", err))
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.origin + `/post/${articleData._id}`)
        .then(() => {
          alert("Link copied to clipboard!")
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

  const truncateContent = (text, maxLength = 200) => {
    if (!text) return "No content available"

    // Remove any markdown formatting for cleaner preview
    const plainText = text
      .replace(/^#+\s+/gm, "") // Remove heading markers
      .replace(/^>\s+/gm, "") // Remove blockquote markers
      .replace(/\*\*|\*|~~|`|_/g, "") // Remove formatting characters

    if (plainText.length <= maxLength) return plainText

    // Find a good breaking point (end of sentence or space)
    const breakPoint = plainText.substring(0, maxLength).lastIndexOf(". ")
    const endPoint = plainText.substring(0, maxLength).lastIndexOf(" ")
    const breakText = plainText.substring(0, maxLength)

    return plainText.substring(0, endPoint > 0 ? endPoint : maxLength) + "..."
  }

  // Update the displayMedia function to handle both image and video types
  const displayMedia = () => {
    if (!articleData.mediaUrl) return null

    if (articleData.mediaType === "image") {
      return (
        <div className="w-full relative overflow-hidden rounded-lg">
          <div className="w-full aspect-[16/9] relative overflow-hidden">
            {!mediaLoaded && !mediaError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              className={`object-cover scale-95 rounded-md transition-opacity duration-300 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
              src={articleData.mediaUrl || "/placeholder.svg"}
              alt={articleData.title || "Article image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
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
    } else if (articleData.mediaType === "video") {
      const youtubeID = getYouTubeID(articleData.mediaUrl)

      return (
        <div className="w-full relative overflow-hidden rounded-lg">
          <div className="w-full aspect-[16/9] relative overflow-hidden">
            {!mediaLoaded && !mediaError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Video thumbnail with play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full bg-mainColor/80 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
              </div>
            </div>

            <Image
              src={youtubeID ? `https://img.youtube.com/vi/${youtubeID}/hqdefault.jpg` : "/placeholder.svg"}
              alt={articleData.title || "Video thumbnail"}
              fill
              className="object-cover scale-95 rounded-md "
              onLoad={() => setMediaLoaded(true)}
              onError={() => {
                setMediaError(true)
                setMediaLoaded(true)
              }}
            />
          </div>
        </div>
      )
    }

    return null
  }

  // Improve the YouTube ID extraction function to handle more URL formats
  const getYouTubeID = (url) => {
    if (!url) return null

    // Handle different YouTube URL formats
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  const handleDeleteArticle = async (e) => {
    e.stopPropagation()

    try {
      setIsDeleting(true)
      setShowOptions(false)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${articleData._id}`, {
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

        // Refresh the page or update the article list after a short delay
        setTimeout(() => {
          if (typeof window !== "undefined") {
            // If we're on the profile page, refresh to update the article list
            if (window.location.pathname.includes("/profile")) {
              window.location.reload()
            }
            // If we're on the article page, redirect to home
            else if (window.location.pathname.includes(`/post/${articleData._id}`)) {
              router.push("/")
            }
          }
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

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full my-2 max-w-3xl mx-auto"
      >
        <div
          className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
          role="article"
          tabIndex="0"
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          aria-label={`Article: ${articleData.title || "Untitled"}`}
        >
          {/* Header with user info */}
          <div className="p-4 flex items-center justify-between">
            <Link
              href={`/profile/${articleData.authorId?.username || articleData.authorusername || "unknown"}`}
              className="flex items-center space-x-2 group"
              onClick={(e) => e.stopPropagation()}
            >
              {articleData.authorId?.profilePicture ? (
                <div className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src={articleData.authorId.profilePicture || "/placeholder.svg"}
                    alt={articleData.authorId?.displayname || "Unknown"}
                    width="60"
                    height="60"
                    className="h-full w-full object-cover"
                    />
                </div>
              ) : (
                <div className="rounded-full bg-mainColor w-10 h-10 flex items-center justify-center text-white font-semibold group-hover:shadow-md transition-shadow">
                  {articleData.authorId?.displayname ? articleData.authorId.displayname[0].toUpperCase() : "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 capitalize group-hover:underline">
                  {articleData.authorId?.displayname || "Unknown"}
                </p>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {articleData.authorId?.username
                      ? `@${articleData.authorId.username}`
                      : articleData.authorusername
                        ? `@${articleData.authorusername}`
                        : "N/A"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <time dateTime={articleData.publishedAt}>{calculateTimeAgo(articleData.publishedAt)}</time>
                  </span>
                </div>
              </div>
            </Link>

            {/* Options button */}
            <div className="relative" ref={optionsRef}>
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowOptions(!showOptions)
                }}
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
                    {user && user.username === (articleData.authorId?.username || articleData.authorusername) ? (
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                        onClick={(e) => handleDeleteArticle(e)}
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
          <div className="px-4 pb-2 flex items-center space-x-2">
            <Link
              href={`/categories/${articleData.category?.toLowerCase() || "general"}`}
              className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full capitalize hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Category: ${articleData.category || "General"}`}
            >
              {articleData.category || "General"}
            </Link>


            {/* Numerical Rating Display */}
            {articleData.rating !== undefined && articleData.rating !== 0 ? (
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getRatingColor(articleData.rating)}`}
                title="Article trustworthiness rating"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>{Math.round(articleData.rating)}%</span>
              </div>
            ) : articleData.rating === 0 ? (
              <div
                className="px-2 py-1 text-xs font-medium rounded-full flex items-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                title="Rating needs calculation"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                <span>Pending</span>
              </div>
            ) : null}
          </div>

          {/* Title */}
          <div className="px-4 pb-4">
            <h2 className="font-serif font-bold text-xl text-gray-900 dark:text-gray-100 capitalize hover:underline decoration-2 underline-offset-2">
              {articleData.title}
            </h2>
          </div>

          {/* Content preview */}
          <div className="px-4 pb-3">
            <p className="text-gray-600 break-words dark:text-gray-300 text-md">
              {articleData.description
                ? formatText(articleData.description)
                : formatText(truncateContent(articleData.content, 150))}
            </p>

            {/* Add this new element to indicate this is just a preview */}
            <div className="mt-2 flex items-center text-sm">
              <ChevronRight className="w-4 h-4 text-mainColor mr-1" />
              <span className="font-medium text-mainColor">Read full article</span>
            </div>
          </div>

          {/* Media */}
          <div>{displayMedia()}</div>

          {/* Action bar */}
          <div className="p-4 pt-3">
            <div className="flex items-center justify-between">
              {/* Engagement stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <ArrowBigUp className="w-4 h-4" />
                  <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ArrowBigDown className="w-4 h-4" />
                  <span>{dislikeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{articleData.comments?.length || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{articleData.views || 0}</span>
                </div>
              </div>

              {/* Save button */}
              <button
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? "text-yellow-500 dark:text-yellow-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400"
                }`}
                onClick={toggleSave}
                aria-label={isSaved ? "Unsave article" : "Save article"}
                aria-pressed={isSaved}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
            <Link
              href={`/post/${articleData._id}#comments`}
              className="p-3 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Comments (${articleData.comments?.length || 0})`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comment</span>
            </Link>

            <button
              className="p-3 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </motion.article>

      {/* Report Modal */}
      <ReportModal
        articleId={articleData._id}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSuccess={handleReportSuccess}
      />
    </>
  )
}

export default Article
