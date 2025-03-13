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
  InfoIcon,
  Laptop,
  HeartPulse,
  Trophy,
  Landmark,
  TestTube,
  Briefcase,
  Music,
  Film,
  Utensils,
  Plane,
  Gamepad2,
  ShoppingBag,
  Leaf,
  Palette,
  Lightbulb,
  ChevronRight,
  Search,
  Filter,
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
  const [categorySearch, setCategorySearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = [
    {
      id: "technology",
      name: "Technology",
      icon: <Laptop className="w-4 h-4" />,
      description: "Latest in tech, gadgets, and digital innovation",
      color: "bg-blue-500",
      type: "news",
    },
    {
      id: "health",
      name: "Health",
      icon: <HeartPulse className="w-4 h-4" />,
      description: "Wellness, medical breakthroughs, and health advice",
      color: "bg-red-500",
      type: "news",
    },
    {
      id: "sports",
      name: "Sports",
      icon: <Trophy className="w-4 h-4" />,
      description: "Sports news, results, and athlete stories",
      color: "bg-green-500",
      type: "news",
    },
    {
      id: "politics",
      name: "Politics",
      icon: <Landmark className="w-4 h-4" />,
      description: "Political developments, policy changes, and governance",
      color: "bg-purple-500",
      type: "news",
    },
    {
      id: "science",
      name: "Science",
      icon: <TestTube className="w-4 h-4" />,
      description: "Scientific discoveries, research, and innovations",
      color: "bg-indigo-500",
      type: "news",
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Business news, market trends, and economic updates",
      color: "bg-amber-500",
      type: "news",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Film className="w-4 h-4" />,
      description: "Movies, TV shows, celebrity news, and entertainment",
      color: "bg-pink-500",
      type: "lifestyle",
    },
    {
      id: "music",
      name: "Music",
      icon: <Music className="w-4 h-4" />,
      description: "Music news, album releases, and artist interviews",
      color: "bg-violet-500",
      type: "lifestyle",
    },
    {
      id: "food",
      name: "Food",
      icon: <Utensils className="w-4 h-4" />,
      description: "Recipes, restaurant reviews, and culinary trends",
      color: "bg-orange-500",
      type: "lifestyle",
    },
    {
      id: "travel",
      name: "Travel",
      icon: <Plane className="w-4 h-4" />,
      description: "Travel destinations, tips, and adventure stories",
      color: "bg-sky-500",
      type: "lifestyle",
    },
    {
      id: "education",
      name: "Education",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Educational news, learning resources, and academic insights",
      color: "bg-emerald-500",
      type: "knowledge",
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <Gamepad2 className="w-4 h-4" />,
      description: "Video game news, reviews, and gaming culture",
      color: "bg-rose-500",
      type: "entertainment",
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: <ShoppingBag className="w-4 h-4" />,
      description: "Fashion trends, style tips, and industry news",
      color: "bg-fuchsia-500",
      type: "lifestyle",
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Leaf className="w-4 h-4" />,
      description: "Environmental news, sustainability, and climate change",
      color: "bg-teal-500",
      type: "news",
    },
    {
      id: "art",
      name: "Art & Design",
      icon: <Palette className="w-4 h-4" />,
      description: "Art exhibitions, design trends, and creative inspiration",
      color: "bg-cyan-500",
      type: "lifestyle",
    },
    {
      id: "innovation",
      name: "Innovation",
      icon: <Lightbulb className="w-4 h-4" />,
      description: "Innovative ideas, startups, and future technologies",
      color: "bg-lime-500",
      type: "knowledge",
    },
  ]

  // Filter types for category filtering
  const filterTypes = [
    { id: "all", name: "All" },
    { id: "news", name: "News" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "knowledge", name: "Knowledge" },
    { id: "entertainment", name: "Entertainment" },
  ]

  // Filter categories based on search and type filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      category.description.toLowerCase().includes(categorySearch.toLowerCase())
    const matchesFilter = categoryFilter === "all" || category.type === categoryFilter
    return matchesSearch && matchesFilter
  })

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
    if (!formData.category) newErrors.category = "Category is required"

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
      // Filter out empty sources
      const filteredSources = formData.sources.filter((source) => source.value.trim() !== "")

      // Create the article data object
      const articleData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || "General",
        status: "on-going",
        sources: filteredSources,
      }

      // Handle media URL - only process URL media, ignore file uploads
      if (formData.media.sourceType === "url" && formData.media.url) {
        // Make sure URL starts with http:// or https://
        let mediaUrl = formData.media.url
        if (!mediaUrl.match(/^https?:\/\//i)) {
          mediaUrl = "https://" + mediaUrl
        }
        articleData.imageUrl = mediaUrl
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
  const getSourceIcon = (type) => {
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
  }

  // Function to safely render image preview
  const renderImagePreview = () => {
    // Only show preview for file uploads, not for URLs
    if (formData.media.sourceType === "upload" && mediaPreview) {
      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
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
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-secondaryColor dark:bg-gray-700 flex items-center justify-center">
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
                <InfoIcon className="w-4 h-4 mr-1" />
                <span>Formatting guide:</span>
                <br className="mt-1" />
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">**bold**</span>
                <span>for bold</span>
                <br className="mt-1" />
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  *underline*
                </span>
                <span>for underline</span>
                <br className="mt-1" />
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">_italic_</span>
                <span>for italic</span>
                <br className="mt-1" />
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  ~~strikethrough~~
                </span>
                <span>for strikethrough</span>
                <br className="mt-1" />
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">`code`</span>
                <span>for code</span>
              </p>
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>

              <div className={`relative ${errors.category ? "mb-1" : "mb-0"}`}>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border appearance-none ${
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-90" />
                </div>
              </div>

              {errors.category && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category}
                </p>
              )}

              {/* Category Preview */}
              {formData.category && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  {categories.map(
                    (cat) =>
                      cat.id === formData.category && (
                        <div key={cat.id} className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${cat.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center`}
                          >
                            {cat.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{cat.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}

              {/* Category Search and Filter */}
              <div className="mt-4 mb-3 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
                    <Filter className="w-3 h-3" /> Filter:
                  </span>
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

              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleChange("category", cat.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        formData.category === cat.id
                          ? `${cat.color} bg-opacity-20 dark:bg-opacity-30 border-${cat.color.split("-")[1]}-400 dark:border-${cat.color.split("-")[1]}-500`
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } flex items-center gap-2`}
                    >
                      <div className={`w-6 h-6 rounded-md ${cat.color} flex items-center justify-center`}>
                        {cat.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center">
                    <div className="mx-auto w-12 h-12 mb-3 text-gray-300 dark:text-gray-600">
                      <Search className="w-full h-full" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">No categories found</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategorySearch("")
                        setCategoryFilter("all")
                      }}
                      className="mt-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Media Section */}
            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
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
                      <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">
                        Note: File upload is currently disabled. Please use URL option.
                      </p>
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
            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
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
                      className="p-2 transition-colors opacity-80"
                      aria-label="Remove source"
                    >
                      <Trash2 className="w-4 h-4 text-primary hover:text-red-500" />
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

