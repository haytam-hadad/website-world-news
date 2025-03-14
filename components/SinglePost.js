"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Clock,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Flag,
  Bell,
  BellOff,
  Bookmark,
  Copy,
  Link2,
  Facebook,
  Twitter,
  Eye,
} from "lucide-react"
import { useState, useContext, useRef, useEffect } from "react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import Comment from "@/components/Comment"
import { ThemeContext } from "../app/ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"
import SourcesDisplay from "./sources-display"

const formatText = (text) => {
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
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|_[^_]+_)/).map((chunk, index) => {
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

const SinglePost = ({ post }) => {
  const [vote, setVote] = useState(null)
  const [voteCount, setVoteCount] = useState(post.likes || 0)
  const [subscribed, setSubscribed] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const { user } = useContext(ThemeContext)
  const shareRef = useRef(null)
  const commentInputRef = useRef(null)

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShareOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Check if URL has #comments anchor and scroll to comments
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#comments" && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current.scrollIntoView({ behavior: "smooth" })
        commentInputRef.current.focus()
      }, 500)
    }
  }, [])

  const handleUpvote = () => {
    if (vote === "upvote") {
      setVote(null)
      setVoteCount(voteCount - 1)
    } else {
      setVote("upvote")
      setVoteCount(vote === "downvote" ? voteCount + 2 : voteCount + 1)
    }
  }

  const handleDownvote = () => {
    if (vote === "downvote") {
      setVote(null)
      setVoteCount(voteCount + 1)
    } else {
      setVote("downvote")
      setVoteCount(vote === "upvote" ? voteCount - 2 : voteCount - 1)
    }
  }

  const toggleSubscribe = () => {
    setSubscribed(!subscribed)
  }

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObj = {
        id: Date.now(),
        userProfilename: user.displayname,
        username: user.username,
        text: newComment,
        timeAgo: "Just now",
        avatar: user.displayname.charAt(0).toUpperCase(),
      }
      setComments([...comments, newCommentObj])
      setNewComment("")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title || "Check out this article",
          text: post.description || post.content?.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          setShowShareOptions(!showShareOptions)
        })
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowShareOptions(false)
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title || "")}`,
      "_blank",
    )
    setShowShareOptions(false)
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank")
    setShowShareOptions(false)
  }

  const calculateTimeAgo = (t) => {
    if (!t) return "N/A"
    const publishedDate = new Date(t?.$date || t)
    if (isNaN(publishedDate.getTime())) return "N/A"
    const now = new Date()
    const diffInSeconds = Math.floor((now - publishedDate) / 1000)
    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  // Helper function to extract YouTube video ID
  const getYouTubeID = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Helper function to render the appropriate media
  const renderMedia = () => {
    const mediaToUse = post.mediaUrl || null
    const type = post.mediaType || null 

    if (!mediaToUse || !type) return null

    if (type === "image") {
      return (
        <div className="relative w-full aspect-video mb-6 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {!mediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={mediaToUse || "/placeholder.svg"}
            alt={post.title || "Post image"}
            fill
            className={`object-cover transition-opacity duration-300 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
            onLoad={() => setMediaLoaded(true)}
            onError={(e) => {
              e.target.src = "/placeholder.svg"
              setMediaLoaded(true)
            }}
          />
        </div>
      )
    } else if (type === "video") {
      const youtubeID = getYouTubeID(mediaToUse)

      if (youtubeID) {
        return (
          <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeID}`}
              title={post.title || "Video content"}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      } else if (mediaToUse.includes("vimeo")) {
        // Extract Vimeo ID
        const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/
        const vimeoMatch = mediaToUse.match(vimeoRegex)
        const vimeoID = vimeoMatch ? vimeoMatch[1] : null

        if (vimeoID) {
          return (
            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoID}`}
                title={post.title || "Video content"}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )
        }
      } else {
        // Direct video file
        return (
          <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
            <video controls className="w-full h-full" poster="/placeholder.svg">
              <source src={mediaToUse} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      }
    }

    return null
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-1 sm:p-2">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6"
      >
        {/* Author and metadata header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href={post.authorusername ? `/profile/${post.authorusername}` : "#"}>
                <div className="w-12 h-12 rounded-full bg-mainColor text-white flex items-center justify-center text-xl font-semibold shadow-sm">
                  {post.authordisplayname ? post.authordisplayname.charAt(0).toUpperCase() : "U"}
                </div>
              </Link>
              <div>
                <Link
                  href={post.authorusername ? `/profile/${post.authorusername}` : "#"}
                  className="font-semibold text-gray-900 dark:text-white text-lg"
                >
                  {" "}
                  <span className="hover:underline capitalize">{post.authordisplayname || "Unknown"} </span>
                  <span className="text-gray-500 text-sm ml-1 font-normal dark:text-gray-400">
                    {post.authorusername ? `@${post.authorusername}` : ""}
                  </span>
                </Link>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <time dateTime={post.publishedAt?.$date || post.publishedAt}>
                    {calculateTimeAgo(post.publishedAt) || "Unknown"}
                  </time>

                  <div className="flex items-center ml-4">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={toggleSubscribe}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                subscribed
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "bg-mainColor text-white hover:bg-mainColor/90"
              }`}
              aria-pressed={subscribed}
              aria-label={subscribed ? "Unsubscribe from author" : "Subscribe to author"}
            >
              {subscribed ? (
                <>
                  <BellOff className="w-4 h-4" />
                  <span>Unsubscribe</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Post content */}
        <div className="p-4 sm:p-6">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6">
            {post.title || "No Title Available"}
          </h1>

          {/* Description (if available) */}
          {post.description && (
            <div className="mb-6 text-lg text-gray-600 dark:text-gray-300 font-medium italic border-l-4 border-mainColor pl-4 py-2">
              {formatText(post.description)}
            </div>
          )}

          {/* Render media based on type */}
          {renderMedia()}

          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            {formatText(post.content) || "No content available"}
          </div>

          {/* Sources section */}
          <SourcesDisplay sources={post.sources} />

          {/* Category tag */}
          <div className="mb-6">
            <Link href={`/category/${post.category?.toLowerCase() || "general"}`}>
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                {post.category || "General"}
              </span>
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Vote buttons */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <button
                onClick={handleUpvote}
                className={`p-2 flex items-center gap-1 transition-colors ${
                  vote === "upvote"
                    ? "text-green-600 dark:text-green-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                aria-label="Upvote"
                aria-pressed={vote === "upvote"}
              >
                <ArrowBigUp className="w-6 h-6" />
              </button>

              <span className="px-2 font-medium text-sm text-gray-700 dark:text-gray-300">{voteCount}</span>

              <button
                onClick={handleDownvote}
                className={`p-2 transition-colors ${
                  vote === "downvote"
                    ? "text-red-600 dark:text-red-500"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                aria-label="Downvote"
                aria-pressed={vote === "downvote"}
              >
                <ArrowBigDown className="w-6 h-6" />
              </button>
            </div>

            {/* Comment button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
              aria-label={`${comments.length} comments`}
              onClick={() => commentInputRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>

            {/* Share button with dropdown */}
            <div className="relative" ref={shareRef}>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                aria-label="Share"
                aria-expanded={showShareOptions}
                aria-haspopup="true"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                  >
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Copied!" : "Copy link"}
                    </button>

                    <button
                      onClick={shareToTwitter}
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </button>

                    <button
                      onClick={shareToFacebook}
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Share on Facebook
                    </button>

                    <button
                      onClick={() => {
                        setShowShareOptions(false)
                        // Implement email sharing functionality
                        window.location.href = `mailto:?subject=${encodeURIComponent(post.title || "Check out this article")}&body=${encodeURIComponent(`I thought you might be interested in this: ${window.location.href}`)}`
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Share via Email
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="Save article"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Report button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="Report article"
            >
              <Flag className="w-5 h-5" />
            </button>

            {/* More options button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors ml-auto"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.article>

      {/* Comments section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        id="comments"
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments ({comments.length})</h2>

          {/* Add comment form */}
          {user ? (
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-mainColor text-white flex-shrink-0 flex items-center justify-center font-semibold">
                  {user?.displayname?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    ref={commentInputRef}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors resize-none"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    aria-label="Add a comment"
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-mainColor text-white rounded-lg font-medium hover:bg-mainColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Sign in to join the conversation and leave a comment
              </p>
              <Link href="/login">
                <button className="px-4 py-2 bg-mainColor text-white rounded-lg font-medium hover:bg-mainColor/90 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          )}

          {/* Comments list */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  userProfilename={comment.userProfilename}
                  username={comment.username}
                  text={comment.text}
                  timeAgo={comment.timeAgo}
                  avatar={comment.avatar}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SinglePost

