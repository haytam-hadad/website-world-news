"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, Share2, MessageCircle, MoreHorizontal, Flag, Bookmark, BookmarkCheck } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Article = ({ articleData }) => {
  const { _id, title, content, imageUrl, author, publishedAt, category, comments = [] } = articleData
  const [vote, setVote] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const optionsRef = useRef(null)
  const router = useRouter()

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
    router.push(`/post/${_id}`)
  }

  const handleUpvote = (e) => {
    e.stopPropagation()
    setVote(vote !== "upvote" ? "upvote" : null)
  }

  const handleDownvote = (e) => {
    e.stopPropagation()
    setVote(vote !== "downvote" ? "downvote" : null)
  }

  const toggleSave = (e) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    // Here you would implement the actual save functionality with an API call
  }

  const handleShare = (e) => {
    e.stopPropagation()

    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: content?.substring(0, 100) + "...",
          url: `/post/${_id}`,
        })
        .catch((err) => console.error("Error sharing", err))
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.origin + `/post/${_id}`)
        .then(() => {
          alert("Link copied to clipboard!")
        })
        .catch((err) => console.error("Error copying link", err))
    }
  }

  const calculateTimeAgo = (publishedAt) => {
    if (!publishedAt) return "N/A"

    const publishedDate = new Date(publishedAt)

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
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full my-4"
    >
      <div
        className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={handleClick}
        role="article"
        tabIndex="0"
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={`Article: ${title || "Untitled"}`}
      >
        {/* Use grid instead of flex for better layout control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image Container - fixed size on desktop */}
          {imageUrl && (
            <div className="lg:col-span-5 xl:col-span-4 relative">
              <div className="w-full h-64 lg:h-full relative bg-gray-200 dark:bg-gray-700">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <Image
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  src={imageUrl || "/placeholder.svg"}
                  alt={title || "Article image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                  priority
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    setImageError(true)
                    setImageLoaded(true)
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
            </div>
          )}

          {/* Content Container - takes remaining space */}
          <div className={`p-4 lg:p-5 ${imageUrl ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"}`}>
            {/* Author and Time */}
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-mainColor w-10 h-10 flex items-center justify-center text-secondaryColor font-semibold">
                  {author ? author[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize hover:underline">
                    {author || "Unknown"}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <time dateTime={publishedAt}>{calculateTimeAgo(publishedAt)}</time>
              </span>
            </header>

            {/* Title */}
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100 capitalize mb-3 hover:underline decoration-2 underline-offset-2">
              {title}
            </h2>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 sm:line-clamp-4 mb-4 text-sm sm:text-base">
              {truncateContent(content)}
            </p>

            <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Vote Buttons */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <button
                      className={`p-1.5 flex items-center space-x-1 transition-colors ${
                        vote === "upvote"
                          ? "text-green-500 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      onClick={handleUpvote}
                      aria-label="Upvote"
                      aria-pressed={vote === "upvote"}
                    >
                      <ArrowBigUp className="w-6 h-6" />
                      <span className="text-sm font-medium">20</span>
                    </button>

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-600" />

                    <button
                      className={`p-1.5 transition-colors ${
                        vote === "downvote"
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      onClick={handleDownvote}
                      aria-label="Downvote"
                      aria-pressed={vote === "downvote"}
                    >
                      <ArrowBigDown className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Other Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/post/${_id}#comments`)
                      }}
                      aria-label={`Comments (${comments.length || 0})`}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={handleShare}
                      aria-label="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Implement report functionality
                        alert("Report functionality would be implemented here")
                      }}
                      aria-label="Report"
                    >
                      <Flag className="w-5 h-5" />
                    </button>

                    <button
                      className={`p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors ${
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

                    <div className="relative" ref={optionsRef}>
                      <button
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
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
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Implement hide article functionality
                                alert("Hide article functionality would be implemented here")
                              }}
                            >
                              Hide this article
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Implement block author functionality
                                alert("Block author functionality would be implemented here")
                              }}
                            >
                              Block this author
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div
                  className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full capitalize hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/category/${category?.toLowerCase() || "general"}`)
                  }}
                  role="link"
                  tabIndex="0"
                  onKeyDown={(e) =>
                    e.key === "Enter" && router.push(`/category/${category?.toLowerCase() || "general"}`)
                  }
                  aria-label={`Category: ${category || "General"}`}
                >
                  {category || "General"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default Article

