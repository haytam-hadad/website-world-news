"use client"

import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "./../ThemeProvider"
import {
  BarChart3,
  Users,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

// Dashboard stats cards data
const statsCards = [
  {
    title: "Total Views",
    value: "24.5K",
    change: "+12.3%",
    isPositive: true,
    icon: <Eye className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  {
    title: "Total Articles",
    value: "142",
    change: "+8.7%",
    isPositive: true,
    icon: <FileText className="w-5 h-5" />,
    color: "bg-green-500",
  },
  {
    title: "Followers",
    value: "2,845",
    change: "+24.5%",
    isPositive: true,
    icon: <Users className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  {
    title: "Engagement Rate",
    value: "5.2%",
    change: "-1.8%",
    isPositive: false,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-orange-500",
  },
]

// Recent activity data
const recentActivity = [
  {
    type: "comment",
    user: "Sarah Johnson",
    action: "commented on your article",
    article: "The Future of AI in Journalism",
    time: "10 minutes ago",
  },
  {
    type: "like",
    user: "Michael Chen",
    action: "liked your article",
    article: "Climate Change: The Latest Research",
    time: "2 hours ago",
  },
  {
    type: "follow",
    user: "Emma Williams",
    action: "started following you",
    time: "5 hours ago",
  },
  {
    type: "mention",
    user: "David Rodriguez",
    action: "mentioned you in a comment",
    article: "The Economic Impact of Global Pandemics",
    time: "Yesterday",
  },
]

// Popular articles data
const popularArticles = [
  {
    title: "The Future of AI in Journalism",
    views: "12.4K",
    comments: 48,
    category: "Technology",
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    title: "Climate Change: The Latest Research",
    views: "8.7K",
    comments: 32,
    category: "Science",
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    title: "The Economic Impact of Global Pandemics",
    views: "6.2K",
    comments: 27,
    category: "Politics",
    image: "/placeholder.svg?height=80&width=120",
  },
]

const DashboardOverview = () => {
  const { user } = useContext(ThemeContext)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {greeting}, {user?.displayname || "User"}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Here&apos;s what&apos;s happening with your account today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/add">
              <button className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </Link>
            <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</h3>
              </div>
              <div className={`${card.color} p-2 rounded-lg text-white`}>{card.icon}</div>
            </div>
            <div
              className={`flex items-center mt-3 text-sm ${card.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {card.isPositive ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span>{card.change} from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link href="#" className="text-sm text-mainColor hover:underline flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-5">
            <div className="space-y-5">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      {activity.article && <span className="font-medium"> {activity.article}</span>}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                  <button className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Articles</h2>
            <Link href="#" className="text-sm text-mainColor hover:underline flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{article.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Eye className="w-3.5 h-3.5 mr-1" /> {article.views}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <MessageCircle className="w-3.5 h-3.5 mr-1" /> {article.comments}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analytics Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Last 7 days
            </button>
            <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Last 30 days
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-700 dark:text-gray-300 font-medium">Analytics data visualization</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Detailed charts and metrics would appear here
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview


