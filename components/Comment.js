"use client"

import { useState } from "react"
import { Clock, Flag, Share2, MoreHorizontal, Copy } from "lucide-react"
import { motion } from "framer-motion"

const Comment = ({ userProfilename, username, text, timeAgo, onReport }) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full mb-4"
    >
      <div className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow">
        {/* User info and timestamp */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-mainColor flex items-center justify-center text-white font-semibold shadow-sm">
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
        </div>
      </div>
    </motion.div>
  )
}

export default Comment

