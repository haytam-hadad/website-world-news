"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  User,
  TrendingUp,
  Search,
  ExternalLink,
  Bell,
  Users,
  Hash,
} from "lucide-react"
import Image from "next/image"

// Sample data
const sampleSubscriptions = [
  {
    id: 1,
    name: "Emma Watson",
    username: "emmaw",
    bio: "Tech journalist & AI enthusiast",
    followers: "245K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: true,
    lastPosted: "2h ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "David Kim",
    username: "dkim",
    bio: "Climate scientist & environmental reporter",
    followers: "189K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: true,
    lastPosted: "5h ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Priya Sharma",
    username: "psharma",
    bio: "Political analyst & foreign affairs expert",
    followers: "312K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: false,
    lastPosted: "1d ago",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const trendingTopics = [
  {
    id: 1,
    title: "AI Breakthrough in Medical Research",
    views: "1.2M",
    category: "Technology",
    timePosted: "3h ago",
  },
  {
    id: 2,
    title: "Global Climate Summit Results",
    views: "856K",
    category: "Environment",
    timePosted: "5h ago",
  },
  {
    id: 3,
    title: "New Economic Policy Announced",
    views: "723K",
    category: "Business",
    timePosted: "12h ago",
  },
  {
    id: 4,
    title: "Space Exploration Mission Launch",
    views: "1.5M",
    category: "Science",
    timePosted: "1d ago",
  },
]

const suggestedUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    username: "alexj",
    bio: "Tech entrepreneur & investor",
    followers: "542K",
    isVerified: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Chen",
    username: "schen",
    bio: "Award-winning journalist",
    followers: "321K",
    isVerified: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Michael Brown",
    username: "mbrown",
    bio: "Political commentator",
    followers: "189K",
    isVerified: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Section header component
const SectionHeader = ({ icon: Icon, title, action, isExpanded, onToggle, id }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-mainColor mr-2.5" aria-hidden="true" />
        <h3 className="font-bold text-gray-900 dark:text-gray-100" id={id}>
          {title}
        </h3>
      </div>
      {action ? (
        action
      ) : (
        <button
          onClick={onToggle}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none transition-colors duration-300"
          aria-expanded={isExpanded}
          aria-controls={`${id}-content`}
          aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
      )}
    </div>
  )
}

// Subscription item component
const SubscriptionItem = ({ user }) => {
  return (
    <Link
      href={`/profile/${user.username}`}
      className={`block p-3 rounded-xl mb-2.5 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 focus:outline-none group ${
        user.hasNewContent ? "bg-gray-50/80 dark:bg-gray-800/40" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-shadow">
          {user.avatar ? (
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
          {user.hasNewContent && (
            <span
              className="absolute bottom-0 right-0 w-3 h-3 bg-mainColor rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
              aria-hidden="true"
            ></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-mainColor transition-colors">
              {user.name}
            </p>
            {user.isVerified && (
              <CheckCircle size={12} className="text-mainColor flex-shrink-0" aria-label="Verified" />
            )}
          </div>
          <div className="flex items-center text-xs">
            {user.hasNewContent ? (
              <span className="text-mainColor font-medium">New content</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{user.lastPosted}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Trending topic item component
const TrendingTopicItem = ({ topic }) => {
  return (
    <Link
      href={`/search/${encodeURIComponent(topic.title)}`}
      className="block p-3 rounded-xl mb-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-300 focus:outline-none group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1 bg-mainColor/10 p-1.5 rounded-full group-hover:bg-mainColor/20 transition-colors">
          <TrendingUp className="w-3.5 h-3.5 text-mainColor" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-mainColor transition-colors">
            {topic.title}
          </h4>
          <div className="flex items-center mt-1.5 space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{topic.views} views</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" aria-hidden="true"></span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{topic.timePosted}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Suggested user component
const SuggestedUserItem = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-300 group">
      <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-shadow">
          {user.avatar ? (
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-mainColor transition-colors">
              {user.name}
            </p>
            {user.isVerified && (
              <CheckCircle size={12} className="text-mainColor flex-shrink-0" aria-label="Verified" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
        </div>
      </Link>
      <button className="ml-2 px-3.5 py-1.5 text-xs font-medium text-mainColor bg-mainColor/10 hover:bg-mainColor/20 rounded-full transition-all duration-300 shadow-sm hover:shadow">
        Follow
      </button>
    </div>
  )
}

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
}

// Main RightSidebar component
const RightSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    subscriptions: true,
    trending: true,
    suggested: false,
  })
  const [searchQuery, setSearchQuery] = useState("")

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery.trim())}`
      setSearchQuery("")
    }
  }

  // Filter to only show subscribed users
  const filteredSubscriptions = sampleSubscriptions.filter((user) => user.isSubscribed)
  const currentYear = new Date().getFullYear()

  return (
    <aside className="w-[300px] fixed top-0 right-0 h-full bg-white dark:bg-darkgrey border-l border-gray-100 dark:border-gray-800 overflow-y-auto z-30 pt-16 shadow-lg">
      <div className="p-4 space-y-2 h-full flex flex-col">
        {/* Search Box */}
        <div className="mb-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search topics, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-800 rounded-xl py-2.5 pl-11 pr-4 text-darkgrey dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-all duration-300 shadow-sm"
            />
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <Link
            href="/notifications"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow group"
          >
            <div className="relative">
              <Bell className="w-6 h-6 text-mainColor mb-1.5 group-hover:text-mainColor/80 transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                3
              </span>
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              Alerts
            </span>
          </Link>

          <Link
            href="/trends"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow group"
          >
            <Hash className="w-6 h-6 text-mainColor mb-1.5 group-hover:text-mainColor/80 transition-colors" />
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              Trending
            </span>
          </Link>
        </div>

        {/* Subscriptions Section */}
        <section
          aria-labelledby="subscriptions-heading"
          className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-md"
        >
          <SectionHeader
            icon={UserCheck}
            title="Your Subscriptions"
            isExpanded={expandedSections.subscriptions}
            onToggle={() => toggleSection("subscriptions")}
            id="subscriptions-heading"
          />

          <AnimatePresence initial={false}>
            {expandedSections.subscriptions && (
              <motion.div
                id="subscriptions-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((user) => <SubscriptionItem key={user.id} user={user} />)
                  ) : (
                    <div className="text-center py-6">
                      <div className="bg-gray-50 dark:bg-gray-800/70 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No subscriptions yet</p>
                      <Link
                        href="/discover/users"
                        className="text-mainColor text-sm font-medium hover:underline block mt-2 focus:outline-none"
                      >
                        Discover users to follow
                      </Link>
                    </div>
                  )}
                </div>

                {filteredSubscriptions.length > 0 && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/subscriptions"
                      className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                    >
                      See all subscriptions
                      <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </div>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Trending Section */}
        <section
          aria-labelledby="trending-heading"
          className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-md"
        >
          <SectionHeader
            icon={TrendingUp}
            title="Trending Now"
            isExpanded={expandedSections.trending}
            onToggle={() => toggleSection("trending")}
            id="trending-heading"
          />

          <AnimatePresence initial={false}>
            {expandedSections.trending && (
              <motion.div
                id="trending-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {trendingTopics.map((topic) => (
                    <TrendingTopicItem key={topic.id} topic={topic} />
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/trending"
                    className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                  >
                    See all trending topics
                    <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Suggested Users Section */}
        <section
          aria-labelledby="suggested-heading"
          className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-md"
        >
          <SectionHeader
            icon={Users}
            title="Suggested for You"
            isExpanded={expandedSections.suggested}
            onToggle={() => toggleSection("suggested")}
            id="suggested-heading"
          />

          <AnimatePresence initial={false}>
            {expandedSections.suggested && (
              <motion.div
                id="suggested-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {suggestedUsers.map((user) => (
                    <SuggestedUserItem key={user.id} user={user} />
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href="/discover/users"
                    className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                  >
                    See more suggestions
                    <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        <footer className="text-xs text-gray-500 dark:text-gray-400 mt-auto pt-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/help"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none rounded"
            >
              Help Center
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none rounded"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none rounded"
            >
              Privacy
            </Link>
            <Link
              href="/settings"
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none rounded"
            >
              Settings
            </Link>
          </div>
          <p className="mt-3">© {currentYear} World News</p>
        </footer>
      </div>
    </aside>
  )
}

export default RightSidebar

