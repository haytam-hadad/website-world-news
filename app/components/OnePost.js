"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Share2, MessageCircle, MoreHorizontal, Flag, Bell, BellOff, Bookmark, Copy } from "lucide-react"
import { useState, useContext, useRef, useEffect } from "react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import Comment from "../components/Comment"
import { ThemeContext } from "../ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"

const SinglePost = ({ post }) => {
  const [vote, setVote] = useState(null)
  const [voteCount, setVoteCount] = useState(Math.floor(Math.random() * 50) + 5) // Simulated vote count
  const [subscribed, setSubscribed] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [copied, setCopied] = useState(false)
  const { user } = useContext(ThemeContext)
  const shareRef = useRef(null)

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
    setShowShareOptions(!showShareOptions)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowShareOptions(false)
  }

  const calculateTimeAgo = (t) => {
    if (!t) return "N/A"
    const publishedDate = new Date(t)
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

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6"
      >
        {/* Author and metadata header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href={post.author ? `/profile/${post.author}` : "#"}>
                <div className="w-12 h-12 rounded-full bg-mainColor text-white flex items-center justify-center text-xl font-semibold shadow-sm">
                  {post.author ? post.author.charAt(0).toUpperCase() : "U"}
                </div>
              </Link>
              <div>
                <Link
                  href={post.author ? `/profile/${post.author}` : "#"}
                  className="font-semibold text-gray-900 dark:text-white hover:underline text-lg capitalize"
                >
                  {post.author || "Unknown"}
                </Link>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>{calculateTimeAgo(post.publishedAt) || "Unknown"}</span>
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

          {post.imageUrl && post.imageUrl !== "" && (
            <div className="relative w-full aspect-video mb-6 rounded-lg">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title || "Post image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{post.content || "No content available"}</p>
          </div>

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
              >
                <ArrowBigUp className="w-5 h-5" />
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
              >
                <ArrowBigDown className="w-5 h-5" />
              </button>
            </div>

            {/* Comment button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
              aria-label="Comments"
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
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : "",
                      )}&text=${encodeURIComponent(post.title || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                      </svg>
                      Share on Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : "",
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                      </svg>
                      Share on Facebook
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="Save"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            {/* Report button */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              aria-label="Report"
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
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        >
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Comments ({comments.length})</h2>

            {/* Add comment form */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-mainColor text-white flex-shrink-0 flex items-center justify-center font-semibold">
                  {user?.displayname?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors resize-none"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
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
      )}
    </div>
  )
}

export default SinglePost

