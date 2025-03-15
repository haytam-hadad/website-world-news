"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  UserCheck,
  User,
  TrendingUp,
  Clock,
  Calendar,
  ExternalLink,
  Zap,
  Flame,
  PlayCircle,
} from "lucide-react"

// Sample subscriptions data (users)
const sampleSubscriptions = [
  {
    id: 1,
    name: "Emma Watson",
    username: "emmaw",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Tech journalist & AI enthusiast",
    followers: "245K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: true,
    lastPosted: "2h ago",
  },
  {
    id: 2,
    name: "David Kim",
    username: "dkim",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Climate scientist & environmental reporter",
    followers: "189K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: true,
    lastPosted: "5h ago",
  },
  {
    id: 3,
    name: "Priya Sharma",
    username: "psharma",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Political analyst & foreign affairs expert",
    followers: "312K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: false,
    lastPosted: "1d ago",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    username: "mjohnson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Sports commentator & former athlete",
    followers: "521K",
    isVerified: true,
    isSubscribed: true,
    hasNewContent: false,
    lastPosted: "3d ago",
  },
  {
    id: 5,
    name: "Sophia Rodriguez",
    username: "srodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Health & wellness journalist",
    followers: "178K",
    isVerified: false,
    isSubscribed: true,
    hasNewContent: true,
    lastPosted: "Just now",
  },
]

// Sample trending topics
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

// Sample upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Tech Conference 2025",
    date: "Mar 20, 2025",
    time: "9:00 AM",
    category: "Technology",
    isLive: false,
  },
  {
    id: 2,
    title: "Global Health Summit",
    date: "Mar 25, 2025",
    time: "10:30 AM",
    category: "Health",
    isLive: false,
  },
  {
    id: 3,
    title: "Live Interview with Tech CEO",
    date: "Today",
    time: "7:00 PM",
    category: "Business",
    isLive: true,
  },
]

// Section header component
const SectionHeader = ({ icon, title, action, isExpanded, onToggle }) => {
  const Icon = icon

  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-mainColor mr-2" />
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {action ? (
        action
      ) : (
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      )}
    </div>
  )
}

// Subscription item component
const SubscriptionItem = ({ user }) => {
  return (
    <Link href={`/profile/${user.username}`}>
      <div
        className={`p-2 rounded-lg mb-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
          user.hasNewContent ? "bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            {user.hasNewContent && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-mainColor rounded-full border-2 border-white dark:border-darkgrey"></span>
            )}
          </div>

          <div className="flex-1 truncate">
            <div className="flex items-center space-x-1">
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{user.name}</p>
              {user.isVerified && <CheckCircle size={12} className="text-blue-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              {user.hasNewContent ? (
                <span className="text-mainColor">New content</span>
              ) : (
                <span>{user.lastPosted}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Trending topic item component
const TrendingTopicItem = ({ topic }) => {
  return (
    <Link href={`/search/${encodeURIComponent(topic.title)}`}>
      <div className="p-2 rounded-lg mb-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">{topic.title}</h4>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{topic.views} views</span>
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{topic.timePosted}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Event item component
const EventItem = ({ event }) => {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="p-2 rounded-lg mb-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {event.isLive ? (
              <div className="relative">
                <PlayCircle className="w-5 h-5 text-red-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>
            ) : (
              <Calendar className="w-5 h-5 text-mainColor" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{event.title}</h4>
              {event.isLive && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-sm font-medium">
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {event.date} • {event.time}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-sm">
                {event.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Main RightSidebar component
const RightSidebar = () => {
  const [subscriptions, setSubscriptions] = useState(sampleSubscriptions)
  const [expandedSections, setExpandedSections] = useState({
    subscriptions: true,
    trending: true,
    events: true,
  })

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Filter to only show subscribed users
  const filteredSubscriptions = subscriptions.filter((user) => user.isSubscribed)

  return (
    <div className="w-full h-full mb-5 bg-white dark:bg-darkgrey border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-3 space-y-6">
        {/* Subscriptions Section */}
        <div>
          <SectionHeader
            icon={UserCheck}
            title="Subscriptions"
            isExpanded={expandedSections.subscriptions}
            onToggle={() => toggleSection("subscriptions")}
          />

          {expandedSections.subscriptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((user) => <SubscriptionItem key={user.id} user={user} />)
                ) : (
                  <div className="text-center py-6">
                    <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No subscriptions yet</p>
                    <Link
                      href="/discover/users"
                      className="text-mainColor text-sm font-medium hover:underline block mt-2"
                    >
                      Discover users to follow
                    </Link>
                  </div>
                )}
              </div>

              {filteredSubscriptions.length > 0 && (
                <div className="mt-3 text-center">
                  <Link
                    href="/subscriptions"
                    className="inline-flex items-center text-mainColor text-sm font-medium hover:underline"
                  >
                    See all subscriptions
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Trending Section */}
        <div>
          <SectionHeader
            icon={TrendingUp}
            title="Trending Now"
            isExpanded={expandedSections.trending}
            onToggle={() => toggleSection("trending")}
          />

          {expandedSections.trending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {trendingTopics.map((topic) => (
                  <TrendingTopicItem key={topic.id} topic={topic} />
                ))}
              </div>

              <div className="mt-3 text-center">
                <Link
                  href="/trending"
                  className="inline-flex items-center text-mainColor text-sm font-medium hover:underline"
                >
                  See all trending topics
                  <ExternalLink className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div>
          <SectionHeader
            icon={Calendar}
            title="Upcoming Events"
            isExpanded={expandedSections.events}
            onToggle={() => toggleSection("events")}
          />

          {expandedSections.events && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {upcomingEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>

              <div className="mt-3 text-center">
                <Link
                  href="/events"
                  className="inline-flex items-center text-mainColor text-sm font-medium hover:underline"
                >
                  View all events
                  <ExternalLink className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Links */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/discover">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <Zap className="w-5 h-5 text-mainColor mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Discover</span>
              </div>
            </Link>
            <Link href="/saved">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <Bookmark className="w-5 h-5 text-mainColor mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Saved</span>
              </div>
            </Link>
            <Link href="/live">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <PlayCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Live</span>
              </div>
            </Link>
            <Link href="/history">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                <Clock className="w-5 h-5 text-mainColor mx-auto mb-1" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">History</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-2">
            <Link href="/help" className="hover:underline">
              Help Center
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} World News</p>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar

