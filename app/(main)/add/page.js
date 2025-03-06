"use client"
import { useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeContext } from "../../ThemeProvider"
import Image from "next/image"
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

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageType, setImageType] = useState("url")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([
    { id: "technology", name: "Technology" },
    { id: "health", name: "Health" },
    { id: "sports", name: "Sports" },
    { id: "science", name: "Science" },
    { id: "politics", name: "Politics" },
  ])
  const [errors, setErrors] = useState({})
  const [sources, setSources] = useState([{ type: "url", value: "" }])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    // Create image preview for file uploads
    if (imageType === "upload" && imageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(imageFile)
    } else {
      setImagePreview(null)
    }
  }, [imageFile, imageType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!content.trim()) newErrors.content = "Content is required"
    if (!category) newErrors.category = "Please select a category"
    if (imageType === "url" && !imageUrl.trim()) newErrors.image = "Please provide an image URL"
    if (imageType === "upload" && !imageFile) newErrors.image = "Please upload an image"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", formatContent(content))
      formData.append("category", category)

      if (imageType === "url") {
        formData.append("imageUrl", imageUrl)
      } else if (imageFile) {
        formData.append("image", imageFile)
      }

      // Add sources
      formData.append("sources", JSON.stringify(sources.filter((s) => s.value.trim())))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/newpost`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        const data = await response.json()
        setErrors(data.errors || { general: "Failed to create post" })
      }
    } catch (error) {
      console.error("Error creating post:", error)
      setErrors({ general: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatContent = (content) => {
    // Replace markdown-style formatting with HTML
    let formattedContent = content
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, "<u>$1</u>")
    return formattedContent
  }

  const handleAddSource = () => {
    setSources([...sources, { type: "url", value: "" }])
  }

  const handleRemoveSource = (index) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const handleSourceChange = (index, newSource) => {
    setSources(sources.map((source, i) => (i === index ? newSource : source)))
  }

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

  if (!user) {
    return null // Don't render anything while redirecting
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span  className="font-semibold p-1">Back</span>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
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
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.category ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Featured Image
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === "url"}
                      onChange={() => setImageType("url")}
                      className="w-4 h-4 text-mainColor focus:ring-mainColor"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">URL</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="upload"
                      checked={imageType === "upload"}
                      onChange={() => setImageType("upload")}
                      className="w-4 h-4 text-mainColor focus:ring-mainColor"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload</span>
                  </label>
                </div>
              </div>

              {imageType === "url" ? (
                <div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.image ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
                  />
                </div>
              ) : (
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
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                </div>
              )}

              {errors.image && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.image}
                </p>
              )}

              {/* Image Preview */}
              {(imageType === "url" && imageUrl) || imagePreview ? (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imageType === "url" ? imageUrl : imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
              ) : null}
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
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1/4">
                      <select
                        value={source.type}
                        onChange={(e) => handleSourceChange(index, { ...source, type: e.target.value })}
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
                        {getSourceIcon(source.type)}
                      </div>
                      <input
                        type="text"
                        value={source.value}
                        onChange={(e) => handleSourceChange(index, { ...source, value: e.target.value })}
                        placeholder={`Enter ${source.type} reference`}
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

