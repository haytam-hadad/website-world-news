"use client"

import { useState, useRef, useContext, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeContext } from "../app/ThemeProvider"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

const Comment = ({ comment, postId, postAuthorUsername, onDelete, calculateTimeAgo }) => {
  const [showOptions, setShowOptions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const optionsRef = useRef(null)
  const { user } = useContext(ThemeContext)

  // Check if the comment author is the same as the post author
  const isAuthorComment = comment?.author?.username === postAuthorUsername

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

  const handleDeleteComment = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      setShowOptions(false)

      // Call the parent component's delete handler
      await onDelete(comment._id || comment.id)
    } catch (error) {
      console.error("Error in comment deletion:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-3 sm:p-5">
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${comment.author?.username || "unknown"}`}>
          {comment.author?.picture || comment.author?.profilePicture ? (
            <div className="overflow-hidden rounded-full w-10 h-10 flex-shrink-0">
              <Image
                src={comment.author.picture || comment.author.profilePicture || "/placeholder.svg"}
                alt={comment.author.displayname || comment.author.username}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-10 h-10 flex-shrink-0 flex items-center justify-center font-semibold">
              {comment.author?.displayname ? comment.author.displayname[0].toUpperCase() : "U"}
            </div>
          )}
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
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{calculateTimeAgo(comment.createdAt)}</span>

              {/* Delete option only for the comment author */}
              {user && user.username === comment.author?.username && (
                <div className="relative" ref={optionsRef}>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                    onClick={() => setShowOptions(!showOptions)}
                    aria-label="Comment options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 py-1"
                      >
                        <button
                          className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          onClick={handleDeleteComment}
                          disabled={isDeleting}
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
                          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">{comment.text}</p>
        </div>
      </div>
    </div>
  )
}

export default Comment

