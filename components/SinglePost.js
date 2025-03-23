"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeContext } from "../app/ThemeProvider"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  MoreHorizontal,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
} from "lucide-react"

import SourcesDisplay from "./sources-display"
import { TrustRating } from "./article-trust-rating"

const SinglePost = ({ post, initialComments = [] }) => {
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post?.upvote || 0)
  const [downvoteCount, setDownvoteCount] = useState(post?.downvote || 0)
  const [isSaved, setIsSaved] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState(initialComments)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const optionsRef = useRef(null)
  const commentInputRef = useRef(null)
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

  // Fetch comments when component mounts
  useEffect(() => {
    if (post && post._id) {
      fetchComments()
    }
  }, [post])

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

  // Focus comment input when form is shown
  useEffect(() => {
    if (showCommentForm && commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }, [showCommentForm])

  // Fetch comments from the API
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      })

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setLocalComments(data.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoadingComments(false)
    }
  }

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

  const toggleSave = () => {
    setIsSaved(!isSaved)
    // Here you would implement the actual save functionality with an API call
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

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    setCommentError(null)

    if (!commentText.trim()) return
    if (!user) {
      router.push("/login")
      return
    }

    try {
      setIsSubmittingComment(true)

      const commentData = {
        text: commentText.trim(),
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
        credentials: "include", // Important for sending cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to post comment")
      }

      const data = await response.json()

      // Add the new comment to the local state
      setLocalComments((prev) => [data.comment, ...prev])

      // Reset the form
      setCommentText("")
      setShowCommentForm(false)
    } catch (error) {
      console.error("Error posting comment:", error)
      setCommentError(error.message || "Failed to post comment. Please try again.")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Format the date
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
    <div className="max-w-4xl mx-auto p-1">
      <article className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Header with user info */}
        <div className="p-2 sm:p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <Link href={`/profile/${post.authorusername || "unknown"}`} className="flex items-center space-x-2 group">
            <div className="rounded-full bg-mainColor w-10 h-10 flex items-center justify-center text-secondaryColor font-semibold text-lg cursor-pointer group-hover:shadow-md transition-shadow">
              {post.authordisplayname ? post.authordisplayname[0].toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 capitalize group-hover:underline">
                {post.authordisplayname || "Unknown"}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.authorusername ? `@${post.authorusername}` : "N/A"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <time dateTime={post.publishedAt}>{calculateTimeAgo(post.publishedAt)}</time>
                </span>
              </div>
            </div>
          </Link>

          {/* Category tag and options */}
          <div className="flex items-center space-x-1">
            <Link href={`/category/${post.category?.toLowerCase() || "general"}`}>
              <div className="px-3 py-1 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full capitalize hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                {post.category || "General"}
              </div>
            </Link>

            {/* Trust Rating Component */}
            <TrustRating articleData={post} />

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
                  >
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => alert("Hide this post")}
                    >
                      Hide this post
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => alert("Block this user")}
                    >
                      Block this user
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => alert("Report this post")}
                    >
                      Report this post
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
          <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
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
                {localComments.length || 0}
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
      <div className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100" id="comments">
            Comments ({localComments.length})
          </h2>
        </div>

        {/* Comment form */}
        {user ? (
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            {showCommentForm ? (
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-mainColor w-10 h-10 flex-shrink-0 flex items-center justify-center text-secondaryColor font-semibold">
                    {user.displayname ? user.displayname[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <textarea
                      ref={commentInputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write your comment..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none min-h-[100px]"
                    />

                    {commentError && (
                      <div className="mt-2 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {commentError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommentForm(false)
                      setCommentText("")
                      setCommentError(null)
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={isSubmittingComment}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="px-4 py-2 rounded-lg bg-mainColor text-white font-medium hover:bg-mainColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingComment ? (
                      <span className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </span>
                    ) : (
                      "Post Comment"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCommentForm(true)}
                className="flex items-center space-x-3 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 text-left"
              >
                <div className="rounded-full bg-mainColor w-10 h-10 flex-shrink-0 flex items-center justify-center text-secondaryColor font-semibold">
                  {user.displayname ? user.displayname[0].toUpperCase() : "U"}
                </div>
                <span>Write a comment...</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <Link href="/login" className="text-mainColor hover:underline">
                Sign in
              </Link>{" "}
              to join the conversation
            </p>
          </div>
        )}

        {/* Comments list */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoadingComments ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-mainColor mx-auto mb-3 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
            </div>
          ) : localComments.length > 0 ? (
            <>
              {(showAllComments ? localComments : localComments.slice(0, 5)).map((comment, index) => {
                // Check if the comment author is the same as the post author
                const isAuthorComment = comment.author?.username === post.authorusername

                return (
                  <div
                    key={comment._id || comment.id || index}
                    className={`p-3 sm:p-5 ${isAuthorComment ? "bg-blue-50 dark:bg-blue-900/20 border-mainColor" : ""}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Link href={`/profile/${comment.author?.username || "unknown"}`}>
                        <div
                          className={`rounded-full ${isAuthorComment ? "bg-mainColor text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} w-10 h-10 flex-shrink-0 flex items-center justify-center font-semibold`}
                        >
                          {comment.author?.displayname ? comment.author.displayname[0].toUpperCase() : "U"}
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Link href={`/profile/${comment.author?.username || "unknown"}`}>
                              <span className="font-medium capitalize text-gray-900 dark:text-gray-100 hover:underline">
                                {comment.author?.displayname || "Unknown User"}
                              </span>
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              @{comment.author?.username || "unknown"}
                            </span>
                            {isAuthorComment && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-mainColor text-white rounded-full">
                                Author
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {calculateTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                          {comment.text}
                        </p>

                        {/* Comment actions */}
                        <div className="flex items-center mt-2 space-x-3 text-xs">
                          {user && user.username === comment.author?.username && (
                            <button
                              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center"
                              onClick={() => {
                                // Here you would implement the actual delete functionality
                                console.log(`Deleting comment ${comment._id || comment.id}`)
                                // For now, just remove it from the local state
                                setLocalComments((prev) =>
                                  prev.filter((c) => c._id !== comment._id && c.id !== comment.id),
                                )
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Show more/less comments button */}
              {localComments.length > 5 && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => setShowAllComments(!showAllComments)}
                    className="text-mainColor hover:underline flex items-center justify-center mx-auto"
                  >
                    {showAllComments ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show less comments
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show all {localComments.length} comments
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SinglePost

