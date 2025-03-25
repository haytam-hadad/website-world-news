"use client"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  TrendingUp,
  ExternalLink,
  Bell,
  Hash,
  Users,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { ThemeContext } from "../app/ThemeProvider"

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

// User item component (used for both subscribers and subscriptions)
const UserItem = ({ userData, lastActivity, isNew }) => {
  // Calculate time since last activity
  const getTimeSince = (lastActivityDate) => {
    if (!lastActivityDate) return null

    const now = new Date()
    const activityDate = new Date(lastActivityDate)
    const diffInSeconds = Math.floor((now - activityDate) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 604800)}w ago`
  }

  // Check if there's new content (activity in the last 24 hours)
  const hasNewContent = lastActivity && (new Date() - new Date(lastActivity)) / (1000 * 60 * 60) < 24
  const timeSince = getTimeSince(lastActivity)

  return (
    <Link
      href={`/profile/${userData.username}`}
      className={`block p-3 rounded-xl mb-2 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/70 focus:outline-none group ${
        hasNewContent || isNew ? "bg-gray-50/80 dark:bg-gray-800/40 border-l-2 border-mainColor" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-shadow">
          {userData.picture || userData.profilePicture ? (
            <Image
              src={userData.picture || userData.profilePicture || "/placeholder.svg"}
              alt={userData.displayname || userData.username}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-white font-medium">
              {(userData.displayname || userData.username)?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate group-hover:text-mainColor transition-colors">
              {userData.displayname || userData.username}
            </p>
            {userData.isVerified && (
              <CheckCircle size={12} className="text-mainColor flex-shrink-0" aria-label="Verified" />
            )}
            {isNew && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-mainColor/10 text-mainColor">
                New
              </span>
            )}
          </div>
          <div className="flex items-center text-xs">
            {hasNewContent ? (
              <span className="text-mainColor font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> New content
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">{timeSince || "@" + userData.username}</span>
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
      className="block p-3 rounded-xl mb-2 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-300 focus:outline-none group"
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

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
}

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

// Main RightSidebar component
const RightSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    subscriptions: true,
    subscribers: true,
    trending: true,
  })
  const [subscriptions, setSubscriptions] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true)
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(ThemeContext)

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Fetch user subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) {
        setIsLoadingSubscriptions(false)
        return
      }

      try {
        setIsLoadingSubscriptions(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/subscriptions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions")
        }

        const data = await response.json()

        // Process the subscriptions data
        const subscriptionsData = data.subscriptions || []

        // Fetch additional user data for each subscription if needed
        const processedSubscriptions = await Promise.all(
          subscriptionsData.map(async (sub) => {
            // If we already have user data, use it
            if (sub.username || sub.displayname) {
              return {
                ...sub,
                lastActivity: sub.lastActivity || null,
              }
            }

            // Otherwise, try to fetch user data
            try {
              const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sub.userId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })

              if (userResponse.ok) {
                const userData = await userResponse.json()
                return {
                  ...sub,
                  userData,
                  lastActivity: userData.lastActivity || null,
                }
              }

              return sub
            } catch (err) {
              console.error("Error fetching user data for subscription:", err)
              return sub
            }
          }),
        )

        setSubscriptions(processedSubscriptions)
      } catch (err) {
        console.error("Error fetching subscriptions:", err)
        setError("Failed to load subscriptions")
      } finally {
        setIsLoadingSubscriptions(false)
      }
    }

    fetchSubscriptions()
  }, [user])

  // Fetch user subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      if (!user) {
        setIsLoadingSubscribers(false)
        return
      }

      try {
        setIsLoadingSubscribers(true)
        setError(null)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/subscribers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch subscribers")
        }

        const data = await response.json()

        // Process the subscribers data
        const subscribersData = data.subscribers || []

        // Fetch additional user data for each subscriber if needed
        const processedSubscribers = await Promise.all(
          subscribersData.map(async (sub) => {
            // If we already have user data, use it
            if (sub.username || sub.displayname) {
              return {
                ...sub,
                lastActivity: sub.lastActivity || null,
                isNew: Math.random() > 0.7, // Randomly mark some as new for demo purposes
              }
            }

            // Otherwise, try to fetch user data
            try {
              const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${sub.userId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              })

              if (userResponse.ok) {
                const userData = await userResponse.json()
                return {
                  ...sub,
                  userData,
                  lastActivity: userData.lastActivity || null,
                  isNew: Math.random() > 0.7, // Randomly mark some as new for demo purposes
                }
              }

              return sub
            } catch (err) {
              console.error("Error fetching user data for subscriber:", err)
              return sub
            }
          }),
        )

        setSubscribers(processedSubscribers)
      } catch (err) {
        console.error("Error fetching subscribers:", err)
        setError("Failed to load subscribers")
      } finally {
        setIsLoadingSubscribers(false)
      }
    }

    fetchSubscribers()
  }, [user])

  const currentYear = new Date().getFullYear()

  return (
    <aside className="w-[300px] fixed top-0 right-0 h-full bg-white dark:bg-darkgrey border-l border-gray-100 dark:border-gray-800 overflow-y-auto z-30 pt-16 shadow-md">
      <div className="p-4 space-y-4 h-full flex flex-col">
        {/* User Stats Summary - Only show if user is logged in */}
        {user && (
          <div className="bg-gradient-to-r from-mainColor/10 to-main2Color/10 dark:from-mainColor/20 dark:to-main2Color/20 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">{subscriptions.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Subscriptions</div>
              </div>
              <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="text-center flex-1">
                <div className="font-semibold text-lg text-gray-900 dark:text-white">{subscribers.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Subscribers</div>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Section - Only show if user is logged in and has subscriptions */}
        {user && !isLoadingSubscriptions && subscriptions.length > 0 && (
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
                  <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {subscriptions.map((subscription) => (
                      <UserItem
                        key={subscription._id || subscription.userId}
                        userData={subscription.userData || subscription}
                        lastActivity={subscription.lastActivity}
                      />
                    ))}
                  </div>

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
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Subscribers Section - Only show if user is logged in and has subscribers */}
        {user && !isLoadingSubscribers && subscribers.length > 0 && (
          <section
            aria-labelledby="subscribers-heading"
            className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-md"
          >
            <SectionHeader
              icon={Users}
              title="Your Subscribers"
              isExpanded={expandedSections.subscribers}
              onToggle={() => toggleSection("subscribers")}
              id="subscribers-heading"
            />

            <AnimatePresence initial={false}>
              {expandedSections.subscribers && (
                <motion.div
                  id="subscribers-content"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    {subscribers.map((subscriber) => (
                      <UserItem
                        key={subscriber._id || subscriber.userId}
                        userData={subscriber.userData || subscriber}
                        lastActivity={subscriber.lastActivity}
                        isNew={subscriber.isNew}
                      />
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      href="/subscribers"
                      className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                    >
                      See all subscribers
                      <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

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
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
          <p className="mt-3">© {currentYear} Newsify</p>
        </footer>
      </div>
    </aside>
  )
}

export default RightSidebar

