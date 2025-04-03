"use client"

import { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"
import { ThemeContext } from "../app/ThemeProvider"
import {
  FileText,
  ThumbsUp,
  Eye,
  MessageSquare,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// Helper function to get month name
const getMonthName = (monthNum) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[monthNum - 1]
}

// Format large numbers with commas
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function Overview() {
  const { user } = useContext(ThemeContext)
  const [overviewData, setOverviewData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch overview data
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/userprofile/overview`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch overview data")
        }

        const data = await response.json()
        setOverviewData(data)
      } catch (err) {
        console.error("Error fetching overview data:", err)
        setError("Failed to load your statistics. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOverviewData()
  }, [])

  // Get badge styles based on badge type
  const getBadgeStyles = (badge) => {
    switch (badge) {
      case "Platinum":
        return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
      case "Bronze":
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
      case "Iron":
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    }
  }
    // Loading state
    if (isLoading) {
        return (
          <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full max-w-md mb-8" />
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
    
            <Skeleton className="h-64 w-full rounded-xl mb-8" />
    
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )
      }
  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-2 sm:px-10 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View your content performance and engagement statistics
          </p>
        </div>

        {/* User Profile Summary */}
        {overviewData && (
          <Card className="bg-white dark:bg-darkgrey border border-b-2 border-b-mainColor">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-mainColor to-main2Color flex items-center justify-center text-white font-bold text-3xl">
                    {overviewData.profilePicture ? (
                      <Image
                        src={overviewData.profilePicture || "/placeholder.svg"}
                        alt={overviewData.displayname}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      overviewData.displayname?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  {overviewData.badge && (
                    <div
                      className={`absolute -bottom-1 -right-1 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getBadgeStyles(overviewData.badge)}`}
                    >
                      <Award className="w-3 h-3" />
                      {overviewData.badge}
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{overviewData.displayname}</h2>
                  <p className="text-gray-500 dark:text-gray-400">@{overviewData.username}</p>

                  <div className="flex flex-wrap justify-center p-1 sm:justify-start gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Articles</p>
                      <p className="font-bold text-mainColor">{overviewData.totalArticles}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Subscribers</p>
                      <p className="font-bold text-mainColor">{overviewData.totalSubscribers}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Subscriptions</p>
                      <p className="font-bold text-mainColor">{overviewData.totalSubscriptions}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-auto hidden sm:block">
                  <Link href={`/profile/${overviewData.username}`}>
                    <Button variant="outline" className="hover:bg-mainColor" size="sm">
                      View Profile
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Statistics */}
        {overviewData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(overviewData.totalViews)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Upvotes</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(overviewData.totalLikes)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Articles</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(overviewData.totalArticles)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {formatNumber(overviewData.totalComments)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Articles Chart */}
        {overviewData && (
          <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-mainColor" />
                Articles Published by Month
              </CardTitle>
              <CardDescription>Your content creation activity over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full border rounded-md p-2">
                <div className="grid grid-cols-12 h-full gap-2 items-end">
                  {overviewData.articlesByMonth.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-mainColor hover:bg-mainColor/90 rounded-t-sm transition-all"
                          style={{
                            height: `${item.count ? (item.count / Math.max(...overviewData.articlesByMonth.map((m) => m.count))) * 200 : 0}px`,
                            minHeight: item.count ? "4px" : "0",
                          }}
                        ></div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[100px] text-center pointer-events-none">
                          <p className="font-medium text-sm">{getMonthName(item.month)}</p>
                          <p className="text-mainColor text-sm">{item.count} articles</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getMonthName(item.month).substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Most Popular Article */}
        {overviewData && overviewData.mostPopularArticle && (
          <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-mainColor" />
                Most Popular Article
              </CardTitle>
              <CardDescription>Your best performing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-full sm:w-auto sm:flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                    {overviewData.mostPopularArticle.title}
                  </h3>
                  <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{formatNumber(overviewData.mostPopularArticle.views)} views</span>
                  </div>
                </div>

                <Link href={`/article/${overviewData.mostPopularArticle._id}`}>
                  <Button variant="outline" size="sm">
                    View Article
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}

