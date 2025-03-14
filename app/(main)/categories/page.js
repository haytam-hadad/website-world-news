"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
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
  BookOpen,
  Gamepad2,
  ShoppingBag,
  Leaf,
  Palette,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [visibleCategories, setVisibleCategories] = useState([])

  // All available categories with their icons and descriptions
  const allCategories = [
    {
      id: "technology",
      name: "Technology",
      icon: <Laptop className="w-5 h-5" />,
      description: "Latest in tech, gadgets, and digital innovation",
      color: "bg-blue-500",
      type: "news",
      featured: true,
      articleCount: 1243,
    },
    {
      id: "health",
      name: "Health",
      icon: <HeartPulse className="w-5 h-5" />,
      description: "Wellness, medical breakthroughs, and health advice",
      color: "bg-red-500",
      type: "news",
      featured: true,
      articleCount: 987,
    },
    {
      id: "sports",
      name: "Sports",
      icon: <Trophy className="w-5 h-5" />,
      description: "Sports news, results, and athlete stories",
      color: "bg-green-500",
      type: "news",
      featured: true,
      articleCount: 1567,
    },
    {
      id: "politics",
      name: "Politics",
      icon: <Landmark className="w-5 h-5" />,
      description: "Political developments, policy changes, and governance",
      color: "bg-purple-500",
      type: "news",
      featured: false,
      articleCount: 1089,
    },
    {
      id: "science",
      name: "Science",
      icon: <TestTube className="w-5 h-5" />,
      description: "Scientific discoveries, research, and innovations",
      color: "bg-indigo-500",
      type: "news",
      featured: true,
      articleCount: 876,
    },
    {
      id: "business",
      name: "Business",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Business news, market trends, and economic updates",
      color: "bg-amber-500",
      type: "news",
      featured: true,
      articleCount: 1342,
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Film className="w-5 h-5" />,
      description: "Movies, TV shows, celebrity news, and entertainment",
      color: "bg-pink-500",
      type: "lifestyle",
      featured: false,
      articleCount: 1654,
    },
    {
      id: "music",
      name: "Music",
      icon: <Music className="w-5 h-5" />,
      description: "Music news, album releases, and artist interviews",
      color: "bg-violet-500",
      type: "lifestyle",
      featured: false,
      articleCount: 743,
    },
    {
      id: "food",
      name: "Food",
      icon: <Utensils className="w-5 h-5" />,
      description: "Recipes, restaurant reviews, and culinary trends",
      color: "bg-orange-500",
      type: "lifestyle",
      featured: false,
      articleCount: 892,
    },
    {
      id: "travel",
      name: "Travel",
      icon: <Plane className="w-5 h-5" />,
      description: "Travel destinations, tips, and adventure stories",
      color: "bg-sky-500",
      type: "lifestyle",
      featured: false,
      articleCount: 765,
    },
    {
      id: "education",
      name: "Education",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Educational news, learning resources, and academic insights",
      color: "bg-emerald-500",
      type: "knowledge",
      featured: false,
      articleCount: 543,
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <Gamepad2 className="w-5 h-5" />,
      description: "Video game news, reviews, and gaming culture",
      color: "bg-rose-500",
      type: "entertainment",
      featured: false,
      articleCount: 987,
    },
    {
      id: "fashion",
      name: "Fashion",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Fashion trends, style tips, and industry news",
      color: "bg-fuchsia-500",
      type: "lifestyle",
      featured: false,
      articleCount: 654,
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Leaf className="w-5 h-5" />,
      description: "Environmental news, sustainability, and climate change",
      color: "bg-teal-500",
      type: "news",
      featured: false,
      articleCount: 432,
    },
    {
      id: "art",
      name: "Art & Design",
      icon: <Palette className="w-5 h-5" />,
      description: "Art exhibitions, design trends, and creative inspiration",
      color: "bg-cyan-500",
      type: "lifestyle",
      featured: false,
      articleCount: 321,
    },
    {
      id: "innovation",
      name: "Innovation",
      icon: <Lightbulb className="w-5 h-5" />,
      description: "Innovative ideas, startups, and future technologies",
      color: "bg-lime-500",
      type: "knowledge",
      featured: false,
      articleCount: 543,
    },
  ]

  // Filter types for the category filter
  const filterTypes = [
    { id: "all", name: "All Categories" },
    { id: "news", name: "News" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "knowledge", name: "Knowledge" },
    { id: "entertainment", name: "Entertainment" },
  ]

  // Featured categories for the top section
  const featuredCategories = allCategories.filter((cat) => cat.featured)

  // Filter categories based on search and active filter
  useEffect(() => {
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

    setVisibleCategories(filtered)
  }, [searchQuery, activeFilter])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore News Categories</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover content across a wide range of topics, from breaking news to lifestyle, technology, and more.
        </p>
      </motion.div>

      {/* Featured Categories */}
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mainColor" />
            Featured Categories
          </h2>
          <Link
            href="#all-categories"
            className="text-mainColor hover:text-main2Color text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View All Categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {featuredCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className={`h-2 ${category.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${category.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-${category.color.split("-")[1]}-600 dark:text-${category.color.split("-")[1]}-400`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.articleCount} articles</p>
                    </div>
                  </div>
                  <Link href={`/category/${category.id}`}>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-mainColor hover:text-white transition-colors duration-200">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                <Link
                  href={`/category/${category.id}`}
                  className="text-mainColor hover:text-main2Color font-medium text-sm inline-flex items-center gap-1 transition-colors"
                >
                  Browse Articles
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Search and Filter */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row gap-2 items-center justify-between"
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
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filter:
          </span>
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
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

      {/* All Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
      >
        {visibleCategories.length > 0 ? (
          visibleCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <Link href={`/category/${category.id}`} className="block">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-20 dark:bg-opacity-30 flex items-center justify-center text-${category.color.split("-")[1]}-600 dark:text-${category.color.split("-")[1]}-400`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{category.articleCount} articles</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                    </span>
                    <span className="text-mainColor hover:text-main2Color text-sm font-medium inline-flex items-center gap-1 transition-colors">
                      Explore
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-600">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveFilter("all")
              }}
              className="mt-4 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-main2Color transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Newsletter Subscription */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-mainColor to-main2Color rounded-xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-3">Stay Updated</h2>
            <p className="text-white/90 mb-4">
              Subscribe to our newsletter to receive personalized news updates from your favorite categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-full"
              />
              <button className="px-5 py-2.5 bg-white text-mainColor font-medium rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="relative w-48 h-48">
              <Image
                src="/images/i1.svg"
                alt="Newsletter illustration"
                fill
                className="object-contain filter invert opacity-90"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

