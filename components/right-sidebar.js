"use client"

import { useState, useEffect, useContext } from "react"
import Link from "next/link"
import {
  CheckCircle,
  UserCheck,
  ExternalLink,
  Users,
  FolderIcon,
  Layers,
  Globe,
  Building,
  TestTube,
  Briefcase,
  Trophy,
  HeartPulse,
  Laptop,
  GraduationCap,
  Plane,
  Leaf,
  Film,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { ThemeContext } from "../app/ThemeProvider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
      className={`block p-2 px-3 rounded-xl mb-2 hover:bg-gray-50 dark:hover:bg-gray-800/70 focus:outline-none group transition-colors duration-200 ${
        hasNewContent || isNew ? "bg-gray-50/80 dark:bg-gray-800/40 border-l-2 border-mainColor" : ""
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-shadow">
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
          </div>
          <div className="flex items-center text-xs">
            <span className="text-gray-500 dark:text-gray-400">{timeSince || "@" + userData.username}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Add this function before the CategoryItem component
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase()

  // Map category names to appropriate icons
  if (name.includes("tech") || name.includes("technology")) return <Laptop className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("health")) return <HeartPulse className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("sport")) return <Trophy className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("politic")) return <Building className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("science")) return <TestTube className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("business")) return <Briefcase className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("world") || name.includes("global")) return <Globe className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("trend")) return <TrendingUp className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("entertainment")) return <Film className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("education")) return <GraduationCap className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("travel")) return <Plane className="w-3.5 h-3.5 text-mainColor" />
  if (name.includes("nature") || name.includes("environment")) return <Leaf className="w-3.5 h-3.5 text-mainColor" />

  // Default icon
  return <FolderIcon className="w-3.5 h-3.5 text-mainColor" />
}

// Category item component
const CategoryItem = ({ category }) => {
  // Format the category name to be more readable
  const formatCategoryName = (name) => {
    if (!name) return "Uncategorized"
    // Convert to title case and replace hyphens with spaces
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")
  }

  return (
    <Link
      href={`/categories/${category._id}`}
      className="block p-3 rounded-xl mb-2 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all duration-300 focus:outline-none group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1 bg-mainColor/10 p-1.5 rounded-full group-hover:bg-mainColor/20 transition-colors">
          {getCategoryIcon(category._id)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-mainColor transition-colors">
            {formatCategoryName(category._id)}
          </h4>
          <div className="flex items-center mt-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">{category.totalArticles} articles</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Main RightSidebar component
const RightSidebar = () => {
  const [expandedSections, setExpandedSections] = useState(["subscriptions", "subscribers", "categories"])
  const [subscriptions, setSubscriptions] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const { user } = useContext(ThemeContext)

  // Fetch user data (subscriptions and subscribers)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      setIsLoading(true)

      try {
        // Fetch subscriptions and subscribers in parallel
        const [subscriptionsRes, subscribersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/subscriptions`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/subscribers`, {
            credentials: "include",
          }),
        ])

        // Process subscriptions
        if (subscriptionsRes.ok) {
          const data = await subscriptionsRes.json()
          setSubscriptions(data.subscriptions || [])
        }

        // Process subscribers
        if (subscribersRes.ok) {
          const data = await subscribersRes.json()
          setSubscribers(data.subscribers || [])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategories = async () => {
      setIsCategoriesLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/topcategories/`)

        if (!response.ok) {
          if (response.status === 404) {
            setTopCategories([])
            return
          }
          throw new Error(`Failed to fetch top categories: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setTopCategories(data)
      } catch (error) {
        console.error("Error fetching top categories:", error)
        setTopCategories([])
      } finally {
        setIsCategoriesLoading(false)
      }
    }

    fetchTopCategories()
  }, [])

  const currentYear = new Date().getFullYear()

  // Don't show subscription sections if user is not logged in or data is loading
  const showSubscriptions = user && !isLoading && subscriptions.length > 0
  const showSubscribers = user && !isLoading && subscribers.length > 0

  return (
    <aside className="w-[300px] fixed top-0 right-0 h-full bg-white dark:bg-darkgrey border-l border-gray-100 dark:border-gray-800 overflow-y-auto z-30 pt-16 shadow-sm">
      <div className="p-3 space-y-4 h-full flex flex-col">
        {/* User Stats Summary - Only show if user is logged in */}
        {user && (
          <Link
            href={`/profile/${user.username}/subscriptions`}
            className="block bg-lightgrey border hover:border-mainColor dark:bg-thirdColor text-center rounded-lg p-4 cursor-pointer transition-colors duration-200"
          >
            <div className="flex items-center justify-around mb-2">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-primary">{subscriptions.length}</div>
                <div className="text-xs text-primary">Subscriptions</div>
              </div>
              <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-primary">{subscribers.length}</div>
                <div className="text-xs text-primary">Subscribers</div>
              </div>
            </div>
          </Link>
        )}

        <Accordion type="multiple" defaultValue={expandedSections} className="space-y-4">
          {/* Top Categories Section */}
          <AccordionItem
            value="categories"
            className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline group">
              <div className="flex items-center">
                <Layers
                  className="w-5 h-5 text-mainColor mr-2.5 group-hover:text-mainColor/80 transition-colors"
                  aria-hidden="true"
                />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-mainColor/80 transition-colors">
                  Top Categories
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {isCategoriesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mainColor"></div>
                </div>
              ) : topCategories.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">No categories found</div>
              ) : (
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {topCategories.map((category) => (
                    <CategoryItem key={category._id} category={category} />
                  ))}
                </div>
              )}

              <div className="mt-4 text-center">
                <Link
                  href="/categories"
                  className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                >
                  See all categories
                  <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </div>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Subscriptions Section */}
          {showSubscriptions && (
            <AccordionItem
              value="subscriptions"
              className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm"
            >
              <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline group">
                <div className="flex items-center">
                  <UserCheck
                    className="w-5 h-5 text-mainColor mr-2.5 group-hover:text-mainColor/80 transition-colors"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-mainColor/80 transition-colors">
                    Your Subscriptions
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {subscriptions.map((subscription) => (
                    <UserItem
                      key={subscription._id || subscription.userId}
                      userData={subscription}
                      lastActivity={subscription.lastActivity}
                    />
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href={`/profile/${user.username}/subscriptions`}
                    className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                  >
                    See all subscriptions
                    <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Subscribers Section */}
          {showSubscribers && (
            <AccordionItem
              value="subscribers"
              className="bg-white dark:bg-darkgrey rounded-xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm"
            >
              <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline group">
                <div className="flex items-center">
                  <Users
                    className="w-5 h-5 text-mainColor mr-2.5 group-hover:text-mainColor/80 transition-colors"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-mainColor/80 transition-colors">
                    Your Subscribers
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {subscribers.map((subscriber) => (
                    <UserItem
                      key={subscriber._id || subscriber.userId}
                      userData={subscriber}
                      lastActivity={subscriber.lastActivity}
                    />
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    href={`/profile/${user.username}/subscribers`}
                    className="inline-flex items-center text-mainColor text-sm font-medium hover:text-mainColor/80 transition-colors focus:outline-none group"
                  >
                    See all subscribers
                    <div className="ml-1.5 bg-mainColor/10 rounded-full p-1 group-hover:bg-mainColor/20 transition-colors">
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </div>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

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

