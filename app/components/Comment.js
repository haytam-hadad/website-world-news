"use client"

import { useState } from "react"
import { Clock, Flag, MessageCircle, Share2, MoreHorizontal, Heart, Copy } from "lucide-react"
import { motion } from "framer-motion"

const Comment = ({ userProfilename, username, text, timeAgo, onReport, onReply }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10))
  const [showActions, setShowActions] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleReply = () => {
    setShowReplyForm(!showReplyForm)
    if (onReply && showReplyForm && replyText.trim()) {
      onReply(replyText)
      setReplyText("")
    }
  }

  const handleSubmitReply = (e) => {
    e.preventDefault()
    if (onReply && replyText.trim()) {
      onReply(replyText)
      setReplyText("")
      setShowReplyForm(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-4"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow">
        {/* User info and timestamp */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {userProfilename ? userProfilename[0].toUpperCase() : "U"}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <span className="font-medium text-gray-900 dark:text-white capitalize hover:underline cursor-pointer">
                  {userProfilename}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1.5">@{username}</span>
              </div>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment text */}
        <div className="ml-13 pl-13">
          <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-line">{text}</p>

          {/* Comment actions */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-1.5 rounded-full transition-colors ${
                liked
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span className="text-xs font-medium">{likeCount}</span>}
            </button>

            {/* Reply button */}
            <button
              onClick={handleReply}
              className="flex items-center gap-1 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Reply"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Reply</span>
            </button>

            {/* Share button */}
            <button
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Report button */}
            <button
              onClick={onReport}
              className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Report"
            >
              <Flag className="w-4 h-4" />
            </button>

            {/* More options button */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="More options"
                aria-expanded={showActions}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-1">
                  <button
                    className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      navigator.clipboard.writeText(text)
                      setShowActions(false)
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy text
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      if (onReport) onReport()
                      setShowActions(false)
                    }}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report comment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <form onSubmit={handleSubmitReply} className="flex flex-col">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${userProfilename}...`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-sm"
                  rows="2"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Comment

