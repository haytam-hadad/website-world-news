"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThemeContext } from "../app/ThemeProvider"
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react'
import Comment from "./comment"

const CommentSection = ({ postId, initialComments = [], postAuthorUsername }) => {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState(initialComments)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const commentInputRef = useRef(null)
  const router = useRouter()
  const { user } = useContext(ThemeContext)

  // Fetch comments when component mounts
  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${postId}/comments`, {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${postId}/comments`, {
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

      // Create an enhanced comment with user data
      const enhancedComment = {
        ...data.comment,
        author: {
          username: user.username,
          displayname: user.displayname,
          // Add other user fields as needed
        },
        createdAt: new Date().toISOString(),
        postAuthorUsername: postAuthorUsername // Pass the post author username
      }

      // Add the enhanced comment to the local state
      setLocalComments((prev) => [enhancedComment, ...prev])

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

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete comment")
      }

      // Remove the comment from the local state
      setLocalComments((prev) => prev.filter((comment) => comment._id !== commentId && comment.id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert(error.message || "Failed to delete comment. Please try again.")
    }
  }

  // Calculate time ago for display
  const calculateTimeAgo = (publishedAt) => {
    if (!publishedAt) return "just now" // Default for new comments

    const publishedDate = new Date(publishedAt?.$date || publishedAt)

    // Check if the date is valid
    if (isNaN(publishedDate.getTime())) return "just now"

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
                <div className="rounded-full bg-mainColor w-10 h-10 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture || "/placeholder.svg"}
                      alt={user.displayname || "User"}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  ) : user.displayname ? (
                    user.displayname[0].toUpperCase()
                  ) : (
                    "U"
                  )}
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
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.displayname || "User"}
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="rounded-full bg-mainColor w-10 h-10 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                  {user.displayname ? user.displayname[0].toUpperCase() : "U"}
                </div>
              )}
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
            {localComments.map((comment) => (
              <Comment
                key={comment._id || comment.id || `new-${Date.now()}-${Math.random()}`}
                comment={comment}
                postId={postId}
                postAuthorUsername={postAuthorUsername || comment.postAuthorUsername}
                onDelete={handleDeleteComment}
                calculateTimeAgo={calculateTimeAgo}
              />
            ))}
          </>
        ) : (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection
