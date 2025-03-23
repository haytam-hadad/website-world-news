"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
  ChevronRight,
  ArrowUpRight,
  X,
  Sparkles,
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
  Flame,
  PenTool,
  Film,
  Theater,
  Star,
  Leaf,
  GraduationCap,
  Rocket,
  Plane,
  TrendingUp,
  Laptop,
  HeartPulse,
  Trophy,
} from "lucide-react"

// Define categories with the new structure from add-post page
const allCategories = [
  // Group 1: Trusted News
  {
    id: "world",
    name: "World",
    icon: <Globe className="w-5 h-5" />,
    description: "Global news and international affairs",
    color: "bg-blue-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: true,
  },
  {
    id: "politics",
    name: "Politics",
    icon: <Building className="w-5 h-5" />,
    description: "Political developments, policy changes, and governance",
    color: "bg-red-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: true,
  },
  {
    id: "crime",
    name: "Crime",
    icon: <ShieldAlert className="w-5 h-5" />,
    description: "Crime reports, legal cases, and law enforcement",
    color: "bg-gray-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: false,
  },
  {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Business news, market trends, and corporate updates",
    color: "bg-amber-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: true,
  },
  {
    id: "science",
    name: "Science",
    icon: <TestTube className="w-5 h-5" />,
    description: "Scientific discoveries, research, and innovations",
    color: "bg-indigo-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: true,
  },
  {
    id: "defense",
    name: "Defense",
    icon: <Shield className="w-5 h-5" />,
    description: "Military news, defense technology, and security",
    color: "bg-green-700",
    type: "trusted-news",
    group: "Trusted News",
    featured: false,
  },
  {
    id: "economy",
    name: "Economy",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Economic trends, financial news, and market analysis",
    color: "bg-emerald-500",
    type: "trusted-news",
    group: "Trusted News",
    featured: false,
  },

  // Group 2: Community Reports
  {
    id: "local",
    name: "Local",
    icon: <MapPin className="w-5 h-5" />,
    description: "News and events from your local community",
    color: "bg-orange-500",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },
  {
    id: "facts",
    name: "Facts",
    icon: <CheckSquare className="w-5 h-5" />,
    description: "Fact-checking and verification of news",
    color: "bg-green-500",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },
  {
    id: "investigations",
    name: "Investigations",
    icon: <SearchIcon className="w-5 h-5" />,
    description: "Investigative journalism and in-depth reports",
    color: "bg-purple-500",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },
  {
    id: "humans",
    name: "Humans",
    icon: <Heart className="w-5 h-5" />,
    description: "Personal stories and human interest pieces",
    color: "bg-pink-500",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Career news, job opportunities, and workplace trends",
    color: "bg-blue-600",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },
  {
    id: "events",
    name: "Events",
    icon: <CalendarDays className="w-5 h-5" />,
    description: "Upcoming events, conferences, and gatherings",
    color: "bg-teal-500",
    type: "community-reports",
    group: "Community Reports",
    featured: false,
  },

  // Group 3: Discussions
  {
    id: "sports",
    name: "Sports",
    icon: <Trophy className="w-5 h-5" />,
    description: "Sports news, results, and athlete stories",
    color: "bg-green-600",
    type: "discussions",
    group: "Discussions",
    featured: true,
  },
  {
    id: "trending",
    name: "Trending",
    icon: <Flame className="w-5 h-5" />,
    description: "Hot topics and viral content",
    color: "bg-red-600",
    type: "discussions",
    group: "Discussions",
    featured: false,
  },
  {
    id: "opinions",
    name: "Opinions",
    icon: <PenTool className="w-5 h-5" />,
    description: "Opinion pieces, editorials, and commentary",
    color: "bg-yellow-500",
    type: "discussions",
    group: "Discussions",
    featured: false,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: <Film className="w-5 h-5" />,
    description: "Movies, TV shows, celebrity news, and entertainment",
    color: "bg-pink-600",
    type: "discussions",
    group: "Discussions",
    featured: true,
  },
  {
    id: "culture",
    name: "Culture",
    icon: <Theater className="w-5 h-5" />,
    description: "Arts, culture, and societal trends",
    color: "bg-purple-600",
    type: "discussions",
    group: "Discussions",
    featured: false,
  },
  {
    id: "reviews",
    name: "Reviews",
    icon: <Star className="w-5 h-5" />,
    description: "Product, service, and media reviews",
    color: "bg-amber-600",
    type: "discussions",
    group: "Discussions",
    featured: false,
  },

  // Group 4: General Info
  {
    id: "health",
    name: "Health",
    icon: <HeartPulse className="w-5 h-5" />,
    description: "Health news, medical breakthroughs, and wellness advice",
    color: "bg-red-500",
    type: "general-info",
    group: "General Info",
    featured: true,
  },
  {
    id: "nature",
    name: "Nature",
    icon: <Leaf className="w-5 h-5" />,
    description: "Environmental news, wildlife, and natural phenomena",
    color: "bg-green-500",
    type: "general-info",
    group: "General Info",
    featured: false,
  },
  {
    id: "tech",
    name: "Tech",
    icon: <Laptop className="w-5 h-5" />,
    description: "Technology news, gadgets, and digital innovation",
    color: "bg-blue-500",
    type: "general-info",
    group: "General Info",
    featured: true,
  },
  {
    id: "education",
    name: "Education",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "Educational news, learning resources, and academic insights",
    color: "bg-indigo-500",
    type: "general-info",
    group: "General Info",
    featured: false,
  },
  {
    id: "space",
    name: "Space",
    icon: <Rocket className="w-5 h-5" />,
    description: "Space exploration, astronomy, and cosmic discoveries",
    color: "bg-violet-500",
    type: "general-info",
    group: "General Info",
    featured: false,
  },
  {
    id: "travel",
    name: "Travel",
    icon: <Plane className="w-5 h-5" />,
    description: "Travel destinations, tips, and adventure stories",
    color: "bg-cyan-500",
    type: "general-info",
    group: "General Info",
    featured: false,
  },
]

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [visibleCategories, setVisibleCategories] = useState([])

  // Filter types for the category filter - updated to match add-post page
  const filterTypes = [
    { id: "all", name: "All Categories" },
    { id: "trusted-news", name: "Trusted News" },
    { id: "community-reports", name: "Community Reports" },
    { id: "discussions", name: "Discussions" },
    { id: "general-info", name: "General Info" },
  ]

  // Featured categories for the top section
  const featuredCategories = allCategories.filter((cat) => cat.featured)

  // Use useMemo to avoid unnecessary recalculations
  const filteredCategories = useMemo(() => {
    let filtered = [...allCategories]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((cat) => cat.type === activeFilter)
    }

    return filtered
  }, [allCategories, searchQuery, activeFilter])

  // Update visible categories when filters change - no artificial delay
  useEffect(() => {
    setVisibleCategories(filteredCategories)
  }, [filteredCategories])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  // Function to get a lighter version of the category color for hover effects
  const getLighterColor = (color) => {
    const colorMap = {
      "bg-blue-500": "bg-blue-400",
      "bg-red-500": "bg-red-400",
      "bg-green-500": "bg-green-400",
      "bg-purple-500": "bg-purple-400",
      "bg-indigo-500": "bg-indigo-400",
      "bg-amber-500": "bg-amber-400",
      "bg-pink-500": "bg-pink-400",
      "bg-violet-500": "bg-violet-400",
      "bg-orange-500": "bg-orange-400",
      "bg-sky-500": "bg-sky-400",
      "bg-emerald-500": "bg-emerald-400",
      "bg-rose-500": "bg-rose-400",
      "bg-fuchsia-500": "bg-fuchsia-400",
      "bg-teal-500": "bg-teal-400",
      "bg-cyan-500": "bg-cyan-400",
      "bg-lime-500": "bg-lime-400",
      "bg-gray-500": "bg-gray-400",
      "bg-green-600": "bg-green-500",
      "bg-green-700": "bg-green-600",
      "bg-blue-600": "bg-blue-500",
      "bg-red-600": "bg-red-500",
      "bg-pink-600": "bg-pink-500",
      "bg-purple-600": "bg-purple-500",
      "bg-amber-600": "bg-amber-500",
      "bg-yellow-500": "bg-yellow-400",
    }

    return colorMap[color] || color
  }

  return (
    <div className="w-full px-2 sm:px-3 py-4 sm:py-6">
      {/* Hero Section - More compact for side menus */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-mainColor to-main2Color rounded-xl shadow-lg mb-6 p-4 sm:p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-[5%] left-[10%] w-80 h-80 rounded-full bg-purple-400/20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Discover new perspectives</span>
            </motion.div>

            <motion.h1
              className="text-2xl sm:text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore News Categories
              <span className="block text-yellow-200 mt-1 text-xl sm:text-2xl">Find what interests you</span>
            </motion.h1>

            <motion.p
              className="text-base text-white/90 mb-4 max-w-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover content across a wide range of topics, from breaking news to lifestyle, technology, and more.
            </motion.p>
          </div>
          
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="relative w-full h-[180px]">
                <Image
                  src="/images/i1.svg"
                  alt="Categories Illustration"
                  fill
                  className="object-contain filter invert opacity-90"
                />
              </div>

              {/* Animated elements */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-yellow-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Categories - More compact grid */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-mainColor" />
            Featured Categories
          </h2>
          <Link
            href="#all-categories"
            className="text-mainColor hover:text-main2Color text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {featuredCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              <div
                className={`h-1.5 ${category.color} group-hover:${getLighterColor(category.color)} transition-colors duration-300`}
              ></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-${category.color.split("-")[1]}-600 dark:text-${category.color.split("-")[1]}-400 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">{category.name}</h3>
                    </div>
                  </div>
                  <Link href={`/categories/${category.id}`}>
                    <button className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-mainColor hover:text-white transition-colors duration-200 group-hover:rotate-12 transform">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{category.description}</p>
                <div className="flex justify-between gap-4 items-center">
                  <span className="text-xs px-2 text-center py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {category.group}
                  </span>
                  <Link
                    href={`/categories/${category.id}`}
                    className="text-mainColor text-xs hover:text-main2Color font-medium inline-flex items-center gap-1 transition-colors"
                  >
                    Browse Articles
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Search and Filter - More compact layout */}
      <motion.div
        className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-3 sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        id="all-categories"
      >
        <div className="relative w-full sm:w-auto sm:min-w-[250px]">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? "bg-mainColor text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* All Categories Grid - More compact grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {visibleCategories.length > 0 ? (
          visibleCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              <Link href={`/categories/${category.id}`} className="block">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-9 h-9 rounded-lg ${category.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-${category.color.split("-")[1]}-600 dark:text-${category.color.split("-")[1]}-400 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {category.group}
                    </span>
                    <span className="text-mainColor group-hover:text-main2Color text-sm font-medium inline-flex items-center gap-1 transition-colors group-hover:gap-2">
                      Explore
                      <ArrowUpRight className="w-3.5 h-3.5 transition-all duration-300" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center">
            <div className="mx-auto w-16 h-16 mb-3 text-gray-300 dark:text-gray-600">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveFilter("all")
              }}
              className="mt-3 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-main2Color transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Newsletter Subscription - More compact */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-mainColor to-main2Color rounded-xl p-4 sm:p-6 text-white overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Stay in the loop</span>
            </motion.div>

            <motion.h2
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Never Miss an Update
            </motion.h2>

            <motion.p
              className="text-white/90 mb-3 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Subscribe to our newsletter to receive personalized news updates.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
              />
              <button className="px-4 py-2 bg-white text-mainColor font-medium rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center justify-center gap-2 group">
                Subscribe
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          <div className="hidden md:flex justify-end">
            <motion.div
              className="relative w-32 h-32"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Image
                src="/images/i1.svg"
                alt="Newsletter illustration"
                fill
                className="object-contain filter invert opacity-90"
              />

              {/* Animated elements */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-yellow-300"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

