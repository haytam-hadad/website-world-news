"use client"
import { useState, useContext, useEffect, useMemo, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { ThemeContext } from "../../ThemeProvider"
import {
  Info,
  ChevronDown,
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
  ChevronRight,
  Search,
  X,
  ThumbsUp,
  Camera,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function AddPostPage() {
  const router = useRouter()
  const { user, categories, filterTypes } = useContext(ThemeContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: null,
    category: "",
    status: "on-going", // Add default status to match backend
    media: {
      type: "image", // image or video
      sourceType: "url", // url or upload
      url: "",
      file: null,
    },
    sources: [], // Start with 0 sources
  })

  const [errors, setErrors] = useState({})
  const [mediaPreview, setMediaPreview] = useState(null)
  const [categorySearch, setCategorySearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showCategorySelector, setShowCategorySelector] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  // Memoize filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    const searchTerm = categorySearch.toLowerCase().trim()
    const filterType = categoryFilter

    return categories.filter((category) => {
      const matchesSearch =
        searchTerm === "" ||
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm)

      const matchesFilter = filterType === "all" || category.type === filterType

      return matchesSearch && matchesFilter
    })
  }, [categories, categorySearch, categoryFilter])

  // Get the selected category details
  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.id === formData.category) || null
  }, [categories, formData.category])

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

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreview && mediaPreview.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreview)
      }
    }
  }, [mediaPreview])

  // Handle form field changes
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field when user types
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return prev
    })
  }, [])

  // Handle media changes
  const handleMediaChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [field]: value,
      },
    }))

    // Clear media error when changing media settings
    setErrors((prev) => {
      if (prev.media) {
        const newErrors = { ...prev }
        delete newErrors.media
        return newErrors
      }
      return prev
    })
  }, [])

  // Handle source changes
  const handleSourceChange = useCallback((index, key, value) => {
    setFormData((prev) => {
      const updatedSources = [...prev.sources]

      if (key) {
        updatedSources[index] = { ...updatedSources[index], key }
      } else {
        updatedSources[index] = { ...updatedSources[index], value }
      }

      return {
        ...prev,
        sources: updatedSources,
      }
    })
  }, [])

  // Add new source
  const handleAddSource = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      sources: [...prev.sources, { key: "url", value: "" }],
    }))
  }, [])

  // Remove source
  const handleRemoveSource = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }))
  }, [])

  // Reset category filters
  const resetCategoryFilters = useCallback(() => {
    setCategorySearch("")
    setCategoryFilter("all")
  }, [])

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, media: "Please select an image file" })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, media: "Image size should be less than 5MB" })
      return
    }

    // Set the file in form data
    handleMediaChange("file", file)
    setShowImageModal(true)
  }

  // Upload image to Cloudinary
  const uploadToCloudinary = async () => {
    const file = formData?.media?.file
    if (!file) return

    setUploadingImage(true)
    setUploadProgress(0)

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.error("Cloudinary environment variables are missing.")
      setErrors({ ...errors, media: "Configuration error. Please check your environment variables." })
      setUploadingImage(false)
      return
    }

    try {
      const data = new FormData()
      data.append("file", file)
      data.append("upload_preset", uploadPreset)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.onload = () => {
        setUploadingImage(false)
        setUploadProgress(0)

        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          handleMediaChange("url", response.secure_url)
          setShowImageModal(false)
          handleMediaChange("file", null)
        } else {
          console.error("Upload failed:", xhr.responseText)
          setErrors({ ...errors, media: "Failed to upload image. Please try again." })
        }
      }

      xhr.addEventListener("error", () => {
        console.error("Upload error")
        setErrors({ ...errors, media: "Upload failed due to a network error." })
        setUploadingImage(false)
        setUploadProgress(0)
      })

      xhr.send(data)
    } catch (error) {
      console.error("Unexpected error:", error)
      setErrors({ ...errors, media: "Something went wrong. Please try again." })
      setUploadingImage(false)
    }
  }

  // Cancel image upload
  const cancelImageUpload = () => {
    setShowImageModal(false)
    handleMediaChange("file", null)
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview)
      setMediaPreview(null)
    }
  }

  // Validate URL
  const isValidUrl = useCallback((urlString) => {
    if (!urlString || typeof urlString !== "string" || urlString.trim() === "") {
      return false
    }

    try {
      // Make sure it starts with http:// or https://
      let normalizedUrl = urlString
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = "https://" + normalizedUrl
      }

      // Check if it's a valid URL
      new URL(normalizedUrl)
      return true
    } catch (e) {
      return false
    }
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {}

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"
    if (!formData.category) newErrors.category = "Category is required"

    // Validate URL if provided for URL-based media
    if (formData.media.sourceType === "url" && formData.media.url && !isValidUrl(formData.media.url)) {
      newErrors.media = "Please enter a valid URL (e.g., https://example.com/image.jpg)"
    }

    // Validate sources if any are provided
    formData.sources.forEach((source, index) => {
      if (source.value.trim() && source.key === "url" && !isValidUrl(source.value)) {
        newErrors[`source_${index}`] = "Please enter a valid URL for this source"
      }
    })

    return newErrors
  }, [
    formData.title,
    formData.content,
    formData.category,
    formData.media.sourceType,
    formData.media.url,
    formData.sources,
    isValidUrl,
  ])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate form
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty sources and format them as expected by backend
      const filteredSources = formData.sources
        .filter((source) => source.value.trim() !== "")
        .map((source) => ({
          key: source.key,
          value: source.value.trim(),
        }))

      // Create article data object with validated data
      const articleData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        status: formData.status || "on-going",
        sources: filteredSources,
      }

      // Add description if provided
      if (formData.description && formData.description.trim()) {
        articleData.description = formData.description.trim()
      }

      // Handle media URL and type
      if (formData.media.url) {
        // Make sure URL starts with http:// or https://
        let mediaUrl = formData.media.url
        if (!mediaUrl.match(/^https?:\/\//i)) {
          mediaUrl = "https://" + mediaUrl
        }
        // Store the media type and URL in the appropriate fields
        articleData.mediaType = formData.media.type // Store as "image" or "video"
        articleData.mediaUrl = mediaUrl // Store the URL
      }

      console.log("Submitting article data:", articleData)

      // Make the API request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/newpost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to create post" }))
        throw new Error(errorData.message || "Failed to create post")
      }

      const data = await response.json()
      console.log("Article created successfully:", data)

      // Show success message and redirect after a delay
      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error creating post:", error)
      setErrors({ general: error.message || "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get source icon based on type
  const getSourceIcon = useCallback((type) => {
    const style = "w-4 h-4 text-primary"
    switch (type) {
      case "url":
        return <Link2 className={style} />
      case "book":
        return <BookOpen className={style} />
      case "article":
        return <FileText className={style} />
      case "video":
        return <Video className={style} />
      default:
        return <Link2 className={style} />
    }
  }, [])

  // Function to safely render image preview
  const renderImagePreview = useCallback(() => {
    if (formData.media.sourceType === "upload" && mediaPreview) {
      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
          <Image
            src={mediaPreview || "/placeholder.svg"}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
            width={400}
            height={160}
          />
        </div>
      )
    }

    if (formData.media.sourceType === "url" && formData.media.url) {
      // Make sure URL is properly formatted
      let imageUrl = formData.media.url
      if (!imageUrl.match(/^https?:\/\//i)) {
        imageUrl = "https://" + imageUrl
      }

      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="URL preview"
            className="w-full h-full object-contain"
            width={400}
            height={160}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg"
            }}
          />
        </div>
      )
    }

    return null
  }, [formData.media.sourceType, formData.media.url, mediaPreview])

  // Don't render anything while redirecting
  if (!user) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto p-1"
    >
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-semibold p-1">Back</span>
      </button>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={cancelImageUpload}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-darkgrey rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Image</h3>
                <button
                  onClick={cancelImageUpload}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="w-full h-40 rounded-lg overflow-hidden">
                  <Image
                    src={mediaPreview || "/placeholder.svg"}
                    alt="Image Preview"
                    className="w-full h-full object-cover"
                    width={400}
                    height={160}
                  />
                </div>
              </div>

              {uploadingImage ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-mainColor h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={cancelImageUpload}
                    className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadToCloudinary}
                    className="flex-1 py-2 px-4 bg-mainColor hover:bg-mainColor/90 text-white rounded-lg transition-colors"
                  >
                    Upload
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            {user?.profilePicture ? (
              <Image
                src={user?.profilePicture || "/placeholder.svg"}
                className="w-10 h-10 rounded-full"
                alt={user?.displayname || "User"}
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-mainColor text-white flex items-center justify-center font-semibold text-lg">
                {user?.displayname?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
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

            {/* Category Field - Simplified UI */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>

              {selectedCategory ? (
                <div className="mb-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${selectedCategory.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center`}
                      >
                        {selectedCategory.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{selectedCategory.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {selectedCategory.group}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCategorySelector(true)}
                      className="text-sm text-mainColor hover:text-mainColor/80 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCategorySelector(true)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border ${
                    errors.category ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-600`}
                >
                  <span className={errors.category ? "text-red-500" : "text-gray-500 dark:text-gray-400"}>
                    Select a category
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )}

              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}

              {/* Category Selector Modal */}
              {showCategorySelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white dark:bg-darkgrey rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a Category</h3>
                      <button
                        type="button"
                        onClick={() => setShowCategorySelector(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4">
                      {/* Search and Filter */}
                      <div className="mb-4 space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {categorySearch && (
                            <button
                              type="button"
                              onClick={() => setCategorySearch("")}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {filterTypes.map((filter) => (
                            <button
                              key={filter.id}
                              type="button"
                              onClick={() => setCategoryFilter(filter.id)}
                              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                                categoryFilter === filter.id
                                  ? "bg-mainColor text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              {filter.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Categories List */}
                      <div className="max-h-[50vh] overflow-y-auto pr-1">
                        {filteredCategories.length > 0 ? (
                          <div className="space-y-4">
                            {/* Group categories by type */}
                            {filterTypes.slice(1).map((filter) => {
                              const categoriesInGroup = filteredCategories.filter((cat) => cat.type === filter.id)
                              if (categoryFilter !== "all" && categoryFilter !== filter.id) return null
                              if (categoriesInGroup.length === 0) return null

                              return (
                                <div key={filter.id} className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {filter.name}
                                  </h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {categoriesInGroup.map((cat) => (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          handleChange("category", cat.id)
                                          setShowCategorySelector(false)
                                        }}
                                        className={`p-3 rounded-lg bg-white dark:bg-gray-800 border transition-all ${
                                          formData.category === cat.id
                                            ? `${cat.color} bg-opacity-20 dark:bg-opacity-30 border-${cat.color.split("-")[1]}-400 dark:border-${cat.color.split("-")[1]}-500`
                                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        } flex items-center gap-3 text-left`}
                                      >
                                        <div
                                          className={`w-8 h-8 rounded-md ${cat.color} flex items-center justify-center flex-shrink-0`}
                                        >
                                          {cat.icon}
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-900 dark:text-white block">
                                            {cat.name}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {cat.description}
                                          </span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <div className="mx-auto w-12 h-12 mb-3 text-gray-300 dark:text-gray-600">
                              <Search className="w-full h-full" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">No categories found</p>
                            <button
                              type="button"
                              onClick={resetCategoryFilters}
                              className="mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              Reset filters
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Provide a brief description of your post (optional)..."
                rows="2"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.description ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description}
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
              {/* Formatting Guide */}
              <details className="bg-gray-50 dark:bg-thirdColor text-primary p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-2 transition-shadow duration-200 hover:shadow-sm">
                <summary className="flex items-center gap-2 cursor-pointer">
                  <Info className="w-4 h-4" />
                  <span className="text-md font-medium text-gray-700 dark:text-gray-300">Formatting Guide</span>
                  <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200" />
                </summary>
                <ul className="mt-3 grid gap-1">
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      **bold**
                    </code>
                    <span className="col-span-1 ml-2">
                      for <strong>bold text</strong>
                    </span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      *underline*
                    </code>
                    <span className="col-span-1 ml-2">
                      for <span className="underline">underlined text</span>
                    </span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      __italic__
                    </code>
                    <span className="col-span-1 ml-2">
                      for <em>italic text</em>
                    </span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      ~~strikethrough~~
                    </code>
                    <span className="col-span-1 ml-2">
                      for <span className="line-through">strikethrough</span>
                    </span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      # Heading 1
                    </code>
                    <span className="col-span-1 ml-2">for main titles</span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      ## Heading 2
                    </code>
                    <span className="col-span-1 ml-2">for section titles</span>
                  </li>
                </ul>
              </details>
            </div>

            {/* Media Section - Enhanced with Upload Option */}
            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {formData.media.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  Add Media (Optional)
                </h3>
              </div>

              {/* Media Type Selector */}
              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleMediaChange("type", "image")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    formData.media.type === "image"
                      ? "bg-mainColor/10 border-mainColor text-mainColor"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => handleMediaChange("type", "video")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    formData.media.type === "video"
                      ? "bg-mainColor/10 border-mainColor text-mainColor"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Video
                </button>
              </div>

              {/* Source Type Selector (URL or Upload) */}
              {formData.media.type === "image" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sourceType"
                        checked={formData.media.sourceType === "url"}
                        onChange={() => handleMediaChange("sourceType", "url")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-gray-700 dark:text-gray-300">URL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sourceType"
                        checked={formData.media.sourceType === "upload"}
                        onChange={() => handleMediaChange("sourceType", "upload")}
                        className="w-4 h-4 text-mainColor focus:ring-mainColor"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Upload</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Display media errors */}
              {errors.media && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.media}</span>
                </div>
              )}

              {/* URL Input for Video or Image */}
              {(formData.media.type === "video" || formData.media.sourceType === "url") && (
                <div>
                  <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {formData.media.type === "image" ? "Image URL" : "Video URL"}
                  </label>
                  <input
                    id="mediaUrl"
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

              {/* File Upload for Image */}
              {formData.media.type === "image" && formData.media.sourceType === "upload" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-mainColor hover:text-mainColor/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-mainColor"
                        >
                          <span className="px-2">Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            ref={fileInputRef}
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {((formData.media.sourceType === "url" && formData.media.url) ||
                (formData.media.sourceType === "upload" && mediaPreview)) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
                  {renderImagePreview()}
                </div>
              )}
            </div>

            {/* Sources Section */}
            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Sources (Optional)
                </h3>
              </div>

              {formData.sources.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No sources added yet</p>
                  <button
                    type="button"
                    onClick={handleAddSource}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mainColor/10 text-mainColor rounded-lg hover:bg-mainColor/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Source
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {formData.sources.map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
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
                          className="p-2 transition-colors opacity-80"
                          aria-label="Remove source"
                        >
                          <Trash2 className="w-4 h-4 text-primary hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleAddSource}
                      className="flex items-center gap-1.5 text-sm font-medium text-mainColor hover:text-mainColor/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Source
                    </button>
                  </div>
                </>
              )}

              {/* Recommended Sources */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-mainColor" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add sources to make your post more credible
                  </h4>
                </div>
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

