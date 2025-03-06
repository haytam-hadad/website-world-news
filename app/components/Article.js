"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Clock, Share2, MessageCircle, MoreHorizontal, Flag } from "lucide-react"
import { useState } from "react"
import { ArrowBigUp, ArrowBigDown } from "lucide-react"
import { motion } from "framer-motion"

const Article = ({ articleData }) => {
  const { _id, title, content, imageUrl, author, publishedAt, category } = articleData
  const [vote, setVote] = useState(null)

  const router = useRouter()

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
      >
        {/* Use grid instead of flex for better layout control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Image Container - fixed size on desktop */}
          {imageUrl && (
            <div className="lg:col-span-5 xl:col-span-4 relative">
              <div className="w-full h-64 lg:h-full relative">
                <Image
                  className="object-cover"
                  src={imageUrl || "/placeholder.svg"}
                  alt={title || "Article image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                  priority
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
                {calculateTimeAgo(publishedAt)}
              </span>
            </header>

            {/* Title */}
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 dark:text-gray-100 capitalize mb-3 hover:underline decoration-2 underline-offset-2">
              {title}
            </h2>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 sm:line-clamp-4 mb-4 text-sm sm:text-base">
              {content || "No content available"}
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
                    >
                      <ArrowBigDown className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Other Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Comment"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Report"
                    >
                      <Flag className="w-5 h-5" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div
                  className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full capitalize hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/category/${category?.toLowerCase() || "general"}`)
                  }}
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

