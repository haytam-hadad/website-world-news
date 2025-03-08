"use client"
import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeContext } from "../../ThemeProvider"
import {
  Plus,
  Trash2,
  ImageIcon,
  Link2,
  BookOpen,
  Video,
  FileText,
  AlertCircle,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AddPostPage() {
  const router = useRouter()
  const { user } = useContext(ThemeContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  // Remove the imageError state since we're not showing previews for URLs
  // const [imageError, setImageError] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    media: {
      type: "image", // image or video
      sourceType: "url", // url or upload
      url: "",
      file: null,
    },
    sources: [{ key: "url", value: "" }],
  })

  const [errors, setErrors] = useState({})
  const [mediaPreview, setMediaPreview] = useState(null)

  const categories = [
    { id: "technology", name: "Technology" },
    { id: "health", name: "Health" },
    { id: "sports", name: "Sports" },
    { id: "science", name: "Science" },
    { id: "politics", name: "Politics" },
  ]

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Generate media preview
  useEffect(() => {
    if (formData.media.sourceType === "upload" && formData.media.file) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaPreview(reader.result)
        }
        reader.onerror = () => {
          console.error("Error reading file")
          setMediaPreview(null)
        }
        reader.readAsDataURL(formData.media.file)
      } catch (error) {
        console.error("Error creating preview:", error)
        setMediaPreview(null)
      }
    } else {
      setMediaPreview(null)
    }
  }, [formData.media.file, formData.media.sourceType])

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle media changes
  const handleMediaChange = (field, value) => {
    // Only reset image error when changing media type or source type, not while typing URL
    // if (field === 'file' || field === 'sourceType' || field === 'type') {
    //   setImageError(false);
    // }

    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [field]: value,
      },
    }))
  }

  // Handle source changes
  const handleSourceChange = (index, key, value) => {
    const updatedSources = [...formData.sources]

    if (key) {
      updatedSources[index] = { ...updatedSources[index], key }
    } else {
      updatedSources[index] = { ...updatedSources[index], value }
    }

    setFormData((prev) => ({
      ...prev,
      sources: updatedSources,
    }))
  }

  // Add new source
  const handleAddSource = () => {
    setFormData((prev) => ({
      ...prev,
      sources: [...prev.sources, { key: "url", value: "" }],
    }))
  }

  // Remove source
  const handleRemoveSource = (index) => {
    setFormData((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }))
  }


  // Add this new function to validate URLs before submission
  const isValidUrl = (urlString) => {
    if (!urlString || typeof urlString !== "string" || urlString.trim() === "") {
      return false
    }

    try {
      // Make sure it starts with http:// or https://
      if (!urlString.match(/^https?:\/\//i)) {
        urlString = "https://" + urlString
      }

      // Check if it's a valid URL
      new URL(urlString)
      return true
    } catch (e) {
      return false
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Basic validation - only title and content required
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"

    // Validate URL if provided for URL-based media
    if (formData.media.sourceType === "url" && formData.media.url && !isValidUrl(formData.media.url)) {
      newErrors.media = "Please enter a valid URL (e.g., https://example.com/image.jpg)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Create submission data object
      const submissionData = new FormData()

      // Add basic fields
      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        sources: formData.sources.filter((s) => s.value.trim()),
        mediaType: formData.media.type, // Always include the media type (image or video)
        mediaSourceType: formData.media.sourceType, // Include whether it's url or upload
        hasMedia: false, // Default to false, will set to true if media exists
      }

      // Check if media is provided
      const hasUrlMedia = formData.media.sourceType === "url" && formData.media.url && formData.media.url.trim() !== ""
      const hasFileMedia = formData.media.sourceType === "upload" && formData.media.file !== null

      // Add media URL if using URL source type and URL is provided
      if (hasUrlMedia) {
        // Make sure URL starts with http:// or https://
        let mediaUrl = formData.media.url
        if (!mediaUrl.match(/^https?:\/\//i)) {
          mediaUrl = "https://" + mediaUrl
        }
        postData.mediaUrl = mediaUrl
        postData.hasMedia = true
      }

      // Update hasMedia flag if file is provided
      if (hasFileMedia) {
        postData.hasMedia = true
      }

      // Add the JSON data
      submissionData.append("postData", JSON.stringify(postData))

      // Add file separately if it exists (for upload source type)
      if (hasFileMedia) {
        submissionData.append("mediaFile", formData.media.file)
        // Also add the file type to help server process it correctly
        submissionData.append("mediaFileType", formData.media.file.type)
      }

      console.log("Submitting post data:", postData)
      console.log("Media source type:", formData.media.sourceType)
      console.log("Has media:", postData.hasMedia)

      if (hasFileMedia) {
        console.log("Uploading file:", formData.media.file?.name)
      } else if (hasUrlMedia) {
        console.log("Using media URL:", postData.mediaUrl)
      } else {
        console.log("No media included in this post")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/newpost`, {
        method: "POST",
        body: submissionData,
        credentials: "include",
        headers: formData.media.sourceType === "upload" ? {
          "Content-Type": "multipart/form-data",
        } : {},
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        const data = await response.json().catch(() => ({ message: "Failed to create post" }))
        setErrors({ general: data.message || "Failed to create post" })
      }
    } catch (error) {
      console.error("Error creating post:", error)
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get source icon based on type
  const getSourceIcon = (type) => {
    switch (type) {
      case "url":
        return <Link2 className="w-4 h-4" />
      case "book":
        return <BookOpen className="w-4 h-4" />
      case "article":
        return <FileText className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      default:
        return <Link2 className="w-4 h-4" />
    }
  }

  // Function to safely render image preview
  const renderImagePreview = () => {
    // Only show preview for file uploads, not for URLs
    if (formData.media.sourceType === "upload" && mediaPreview) {
      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaPreview || "/placeholder.svg"}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
        </div>
      )
    }

    // For URL inputs, don't show any preview
    if (formData.media.sourceType === "url") {
      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center p-4">
            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
            <p>No preview available. URL will be used when post is published.</p>
          </div>
        </div>
      )
    }

    return null
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-2"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold p-1">Back</span>
      </button>

      <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-mainColor text-white flex items-center justify-center font-semibold text-lg">
              {user?.displayname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{user?.displayname || "User"}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">@{user?.username}</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Create New Post</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Share your news, insights, or stories with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400"
              >
                <Check className="w-5 h-5" />
                <span>Post created successfully! Redirecting...</span>
              </motion.div>
            )}

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter a descriptive title"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.title ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Write your post content here..."
                rows="8"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.content ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.content}
                </p>
              )}
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-1">
                <span>Formatting:</span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">**bold**</span>
                <span>for bold and</span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  *underline*
                </span>
                <span>for underline</span>
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Section */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {formData.media.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  Media
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 mr-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mediaType"
                        value="image"
                        checked={formData.media.type === "image"}
                        onChange={() => handleMediaChange("type", "image")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mediaType"
                        value="video"
                        checked={formData.media.type === "video"}
                        onChange={() => handleMediaChange("type", "video")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Video</span>
                    </label>
                  </div>

                  {formData.media.type === "image" && (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaSourceType"
                          value="url"
                          checked={formData.media.sourceType === "url"}
                          onChange={() => {
                            handleMediaChange("sourceType", "url")
                            handleMediaChange("url", "") // Reset URL when switching
                          }}
                          className="w-4 h-4 text-mainColor focus:ring-mainColor"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">URL</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaSourceType"
                          value="upload"
                          checked={formData.media.sourceType === "upload"}
                          onChange={() => {
                            handleMediaChange("sourceType", "upload")
                            handleMediaChange("file", null) // Reset file when switching
                          }}
                          className="w-4 h-4 text-mainColor focus:ring-mainColor"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Upload</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Display media errors */}
              {errors.media && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.media}</span>
                </div>
              )}

              {/* Display media errors */}
              {/* Remove this line from the error display section:

              {(errors.media || (imageError && formData.media.url && formData.media.url.trim().length > 10)) && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.media || "Failed to load image. Please check the URL and try again."}</span>
                </div>
              )} */}

              {/* URL Input for Video or Image URL */}
              {(formData.media.type === "video" || formData.media.sourceType === "url") && (
                <div>
                  <input
                    type="text"
                    value={formData.media.url || ""}
                    onChange={(e) => handleMediaChange("url", e.target.value)}
                    placeholder={`Enter ${formData.media.type} URL`}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.media.type === "image"
                      ? "Enter a valid image URL (e.g., https://example.com/image.jpg)"
                      : "Enter a valid video URL (e.g., https://youtube.com/watch?v=...)"}
                  </p>
                </div>
              )}

              {/* File Upload for Images */}
              {formData.media.type === "image" && formData.media.sourceType === "upload" && (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleMediaChange("file", e.target.files[0])
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Image Preview */}
              {formData.media.type === "image" && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  {renderImagePreview()}
                </div>
              )}

              {/* Video URL Preview */}
              {formData.media.type === "video" && formData.media.url && formData.media.url.trim() && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL:</p>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-all">{formData.media.url}</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Video will be embedded when your post is published
                  </p>
                </div>
              )}
            </div>

            {/* Sources Section */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Sources
                </h3>
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="flex items-center gap-1.5 text-sm font-medium text-mainColor hover:text-mainColor/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </div>

              <div className="space-y-3">
                {formData.sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1/4">
                      <select
                        value={source.key}
                        onChange={(e) => handleSourceChange(index, e.target.value, null)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors text-sm"
                      >
                        <option value="url">URL</option>
                        <option value="book">Book</option>
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {getSourceIcon(source.key)}
                      </div>
                      <input
                        type="text"
                        value={source.value}
                        onChange={(e) => handleSourceChange(index, null, e.target.value)}
                        placeholder={`Enter ${source.key} reference`}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(index)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Remove source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-mainColor text-white rounded-lg font-medium hover:bg-mainColor/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish Post
                  <Plus className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

