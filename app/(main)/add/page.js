"use client"
import { useState, useContext, useEffect, useMemo, useCallback } from "react"
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
  Globe,
  Building,
  ShieldAlert,
  Briefcase,
  TestTube,
  Shield,
  DollarSign,
  MapPin,
  CheckSquare,
  SearchIcon,
  Heart,
  CalendarDays,
  ClubIcon as Football,
  Flame,
  PenTool,
  Film,
  Theater,
  Star,
  Stethoscope,
  Leaf,
  Lightbulb,
  GraduationCap,
  Rocket,
  Plane,
  ChevronRight,
  Search,
  X,
  ThumbsUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AddPostPage() {
  const router = useRouter()
  const { user } = useContext(ThemeContext)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: null,
    category: "",
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

  // Define categories with the new structure (removed emojis from names)
  const categories = [
    // Group 1: Trusted News
    {
      id: "world",
      name: "World",
      icon: <Globe className="w-4 h-4" />,
      description: "Global news and international affairs",
      color: "bg-blue-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "politics",
      name: "Politics",
      icon: <Building className="w-4 h-4" />,
      description: "Political developments, policy changes, and governance",
      color: "bg-red-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "crime",
      name: "Crime",
      icon: <ShieldAlert className="w-4 h-4" />,
      description: "Crime reports, legal cases, and law enforcement",
      color: "bg-gray-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Business news, market trends, and corporate updates",
      color: "bg-amber-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "science",
      name: "Science",
      icon: <TestTube className="w-4 h-4" />,
      description: "Scientific discoveries, research, and innovations",
      color: "bg-indigo-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "defense",
      name: "Defense",
      icon: <Shield className="w-4 h-4" />,
      description: "Military news, defense technology, and security",
      color: "bg-green-700",
      type: "trusted-news",
      group: "Trusted News",
    },
    {
      id: "economy",
      name: "Economy",
      icon: <DollarSign className="w-4 h-4" />,
      description: "Economic trends, financial news, and market analysis",
      color: "bg-emerald-500",
      type: "trusted-news",
      group: "Trusted News",
    },
    
    // Group 2: Community Reports
    {
      id: "local",
      name: "Local",
      icon: <MapPin className="w-4 h-4" />,
      description: "News and events from your local community",
      color: "bg-orange-500",
      type: "community-reports",
      group: "Community Reports",
    },
    {
      id: "facts",
      name: "Facts",
      icon: <CheckSquare className="w-4 h-4" />,
      description: "Fact-checking and verification of news",
      color: "bg-green-500",
      type: "community-reports",
      group: "Community Reports",
    },
    {
      id: "investigations",
      name: "Investigations",
      icon: <SearchIcon className="w-4 h-4" />,
      description: "Investigative journalism and in-depth reports",
      color: "bg-purple-500",
      type: "community-reports",
      group: "Community Reports",
    },
    {
      id: "humans",
      name: "Humans",
      icon: <Heart className="w-4 h-4" />,
      description: "Personal stories and human interest pieces",
      color: "bg-pink-500",
      type: "community-reports",
      group: "Community Reports",
    },
    {
      id: "jobs",
      name: "Jobs",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Career news, job opportunities, and workplace trends",
      color: "bg-blue-600",
      type: "community-reports",
      group: "Community Reports",
    },
    {
      id: "events",
      name: "Events",
      icon: <CalendarDays className="w-4 h-4" />,
      description: "Upcoming events, conferences, and gatherings",
      color: "bg-teal-500",
      type: "community-reports",
      group: "Community Reports",
    },
    
    // Group 3: Discussions
    {
      id: "sports",
      name: "Sports",
      icon: <Football className="w-4 h-4" />,
      description: "Sports news, results, and athlete stories",
      color: "bg-green-600",
      type: "discussions",
      group: "Discussions",
    },
    {
      id: "trending",
      name: "Trending",
      icon: <Flame className="w-4 h-4" />,
      description: "Hot topics and viral content",
      color: "bg-red-600",
      type: "discussions",
      group: "Discussions",
    },
    {
      id: "opinions",
      name: "Opinions",
      icon: <PenTool className="w-4 h-4" />,
      description: "Opinion pieces, editorials, and commentary",
      color: "bg-yellow-500",
      type: "discussions",
      group: "Discussions",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Film className="w-4 h-4" />,
      description: "Movies, TV shows, celebrity news, and entertainment",
      color: "bg-pink-600",
      type: "discussions",
      group: "Discussions",
    },
    {
      id: "culture",
      name: "Culture",
      icon: <Theater className="w-4 h-4" />,
      description: "Arts, culture, and societal trends",
      color: "bg-purple-600",
      type: "discussions",
      group: "Discussions",
    },
    {
      id: "reviews",
      name: "Reviews",
      icon: <Star className="w-4 h-4" />,
      description: "Product, service, and media reviews",
      color: "bg-amber-600",
      type: "discussions",
      group: "Discussions",
    },
    
    // Group 4: General Info
    {
      id: "health",
      name: "Health",
      icon: <Stethoscope className="w-4 h-4" />,
      description: "Health news, medical breakthroughs, and wellness advice",
      color: "bg-red-500",
      type: "general-info",
      group: "General Info",
    },
    {
      id: "nature",
      name: "Nature",
      icon: <Leaf className="w-4 h-4" />,
      description: "Environmental news, wildlife, and natural phenomena",
      color: "bg-green-500",
      type: "general-info",
      group: "General Info",
    },
    {
      id: "tech",
      name: "Tech",
      icon: <Lightbulb className="w-4 h-4" />,
      description: "Technology news, gadgets, and digital innovation",
      color: "bg-blue-500",
      type: "general-info",
      group: "General Info",
    },
    {
      id: "education",
      name: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
      description: "Educational news, learning resources, and academic insights",
      color: "bg-indigo-500",
      type: "general-info",
      group: "General Info",
    },
    {
      id: "space",
      name: "Space",
      icon: <Rocket className="w-4 h-4" />,
      description: "Space exploration, astronomy, and cosmic discoveries",
      color: "bg-violet-500",
      type: "general-info",
      group: "General Info",
    },
    {
      id: "travel",
      name: "Travel",
      icon: <Plane className="w-4 h-4" />,
      description: "Travel destinations, tips, and adventure stories",
      color: "bg-cyan-500",
      type: "general-info",
      group: "General Info",
    },
  ]

  // Filter types for category filtering
  const filterTypes = [
    { id: "all", name: "All Categories" },
    { id: "trusted-news", name: "Trusted News" },
    { id: "community-reports", name: "Community Reports" },
    { id: "discussions", name: "Discussions" },
    { id: "general-info", name: "General Info" },
  ]


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

  // Validate URL
  const isValidUrl = useCallback((urlString) => {
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

    return newErrors
  }, [formData.title, formData.content, formData.category, formData.media.sourceType, formData.media.url, isValidUrl])

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
      // Filter out empty sources
      const filteredSources = formData.sources.filter((source) => source.value.trim() !== "")

      const articleData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || "General",
        status: "on-going",
        sources: filteredSources,
        description: formData.description || null,
      }

      // Handle media URL and type - only process URL media, ignore file uploads
      if (formData.media.sourceType === "url" && formData.media.url) {
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

      setSuccess(true)
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

    // Don't show any preview for URL inputs
    return null
  }, [formData.media.sourceType, mediaPreview])

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
          
          {/* Posting Rules Notice */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" />
              Posting Rules
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your post will undergo a review process before being published, as your account is not verified.
            </p>
          </div>
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
                      <div className={`w-10 h-10 rounded-lg ${selectedCategory.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center`}>
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
                              const categoriesInGroup = filteredCategories.filter(cat => cat.type === filter.id);
                              if (categoryFilter !== "all" && categoryFilter !== filter.id) return null;
                              if (categoriesInGroup.length === 0) return null;
                              
                              return (
                                <div key={filter.id} className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{filter.name}</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {categoriesInGroup.map((cat) => (
                                      <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                          handleChange("category", cat.id);
                                          setShowCategorySelector(false);
                                        }}
                                        className={`p-3 rounded-lg bg-white dark:bg-gray-800 border transition-all ${
                                          formData.category === cat.id
                                            ? `${cat.color} bg-opacity-20 dark:bg-opacity-30 border-${cat.color.split("-")[1]}-400 dark:border-${cat.color.split("-")[1]}-500`
                                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        } flex items-center gap-3 text-left`}
                                      >
                                        <div className={`w-8 h-8 rounded-md ${cat.color} flex items-center justify-center flex-shrink-0`}>
                                          {cat.icon}
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-900 dark:text-white block">{cat.name}</span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
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
              <details
                className="bg-gray-50 dark:bg-thirdColor text-primary p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-2 transition-shadow duration-200 hover:shadow-sm"
              >
                <summary className="flex items-center gap-2 cursor-pointer">
                  <Info className="w-4 h-4" />
                  <span className="text-md font-medium text-gray-700 dark:text-gray-300">
                    Formatting Guide
                  </span>
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
                    <span className="col-span-1 ml-2">
                      for main titles
                    </span>
                  </li>
                  <li className="grid grid-cols-2 items-center">
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">
                      ## Heading 2
                    </code>
                    <span className="col-span-1 ml-2">
                      for section titles
                    </span>
                  </li>
                </ul>
              </details>
            </div>

            {/* Media Section - Simplified */}
            <div className="bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  {formData.media.type === "image" ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  Add Media (Optional)
                </h3>
              </div>

              {/* Media Type Selector - Simplified */}
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

              {/* Display media errors */}
              {errors.media && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{errors.media}</span>
                </div>
              )}

              {/* URL Input for Video or Image */}
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
            </div>

            {/* Sources Section - Simplified */}
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
                      <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
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
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Add sources to make your post more credible</h4>
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

