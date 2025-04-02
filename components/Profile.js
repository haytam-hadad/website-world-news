"use client"
import { useContext, useEffect, useState } from "react"
import { Bell, BellOff, Edit, Plus, Calendar, LinkIcon, User, Cake, BookOpen, ArrowUp } from "lucide-react"
import Article from "./Article"
import { ThemeContext } from "../app/ThemeProvider"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Profile = ({ userData }) => {
  const [articles, setArticles] = useState([])
  const [upvotedArticles, setUpvotedArticles] = useState([])
  const [subscriptionState, setSubscriptionState] = useState({
    isSubscribed: false,
    isLoading: false,
  })
  const [activeTab, setActiveTab] = useState("articles")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUpvotes, setIsLoadingUpvotes] = useState(true)
  const { user } = useContext(ThemeContext)

  const isOwnProfile = user && user._id === userData._id

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user || !userData || isOwnProfile) return

      try {
        console.log("Checking subscription status for user:", userData.username)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData._id}/subscription-status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        console.log(response)

        console.log("Subscription status response:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Subscription status data:", data)

          setSubscriptionState((prev) => ({
            ...prev,
            isSubscribed: data.subscribed,
          }))
        }
      } catch (error) {
        console.error("Error checking subscription status:", error)
      }
    }

    checkSubscriptionStatus()
  }, [user, userData, isOwnProfile])

  const toggleSubscribe = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    try {
      setSubscriptionState((prev) => ({ ...prev, isLoading: true }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData._id}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptionState((prev) => ({
          ...prev,
          isSubscribed: data.subscribed,
          isLoading: false,
        }))

        // Update the subscribers count in the UI
        if (data.subscribed) {
          // Adding a subscriber
          userData.subscribers = [
            ...(userData.subscribers || []),
            {
              userId: user._id,
              userModel: user.isGoogleUser ? "Googleuser" : "User",
            },
          ]
        } else {
          // Removing a subscriber
          userData.subscribers = (userData.subscribers || []).filter(
            (sub) => sub.userId.$oid !== user._id && sub.userId !== user._id,
          )
        }
      } else {
        const errorData = await response.json()
        console.error(`Error toggling subscription:`, errorData)
        setSubscriptionState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error(`Error toggling subscription:`, error)
      setSubscriptionState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    const fetchArticles = async (username) => {
      setIsLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${username}`)
        if (!response.ok) {
          if (response.status === 404) {
            setArticles([])
            return
          }
          throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setArticles(data)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    if (userData) {
      fetchArticles(userData.username)
    }
  }, [userData])

  // Fetch upvoted articles when the upvote tab is selected
  useEffect(() => {
    const fetchUpvotedArticles = async (username) => {
      if (activeTab !== "upvoted") return

      setIsLoadingUpvotes(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/upvoted/${username}`)
        if (!response.ok) {
          if (response.status === 404) {
            setUpvotedArticles([])
            return
          }
          throw new Error(`Failed to fetch upvoted articles: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setUpvotedArticles(data)
      } catch (err) {
        console.error("Error fetching upvoted articles:", err)
        setUpvotedArticles([])
      } finally {
        setIsLoadingUpvotes(false)
      }
    }

    if (userData) {
      fetchUpvotedArticles(userData.username)
    }
  }, [userData, activeTab])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.5, 0, 0.5, 1] }}
      className="w-full mx-auto"
    >
      <div className="relative">
        {/* Banner Section */}
        <div className="w-full h-32 sm:h-40 rounded-xl mb-12 shadow-md overflow-hidden">
          {userData.profileBanner ? (
            <Image
              src={userData.profileBanner || "/placeholder.svg"}
              alt={userData.displayname}
              className="object-cover w-full h-full"
              width={1000}
              height={400}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-mainColor to-main2Color"></div>
          )}
        </div>
        {/* Profile Avatar - Positioned to overlap banner and content */}
        <div className="absolute z-20 -bottom-12 left-6 sm:left-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-md">
            {userData.profilePicture ? (
              <Image
                src={userData.profilePicture || "/placeholder.svg"}
                alt={userData.displayname}
                className="w-full h-full object-cover rounded-full"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-mainColor to-main2Color shadow-inner flex items-center justify-center text-white font-bold text-4xl">
                {userData.displayname?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between p-1 pb-3">
        <div className="ml-2 sm:ml-32 mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {userData.displayname || "Unknown"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">@{userData.username || "username"}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {isOwnProfile ? (
            <Link
              href="/dashboard/update-info"
              className="flex items-center gap-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium transition-colors duration-200 shadow-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            <button
              onClick={toggleSubscribe}
              disabled={subscriptionState.isLoading}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                subscriptionState.isSubscribed
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                  : "bg-mainColor text-white hover:bg-mainColor/90"
              } ${subscriptionState.isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {subscriptionState.isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : subscriptionState.isSubscribed ? (
                <>
                  <BellOff className="w-4 h-4" />
                  <span>Unsubscribe</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          )}

          {isOwnProfile && (
            <Link
              href="/add"
              className="flex items-center gap-1.5 bg-mainColor text-white px-4 py-2.5 rounded-lg font-medium hover:bg-mainColor/90 transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-col gap-4 mt-4">
        {/* Left Column - User Info */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-mainColor" />
                About
              </h2>
              <div className="space-y-3">
                {userData.bio ? (
                  <p className="text-gray-700 dark:text-gray-300">{userData.bio}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No bio provided</p>
                )}
                <div className="w-full h-0.5 bg-gray-100 dark:bg-gray-700"></div>
                <div className="pt-1 space-y-3">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-mainColor" />
                    </div>
                    <span>Joined {formatDate(userData.createdAt)}</span>
                  </div>

                  {userData.birthdate && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center flex-shrink-0">
                        <Cake className="w-4 h-4 text-mainColor" />
                      </div>
                      <span>Born {formatDate(userData.birthdate)}</span>
                    </div>
                  )}

                  {userData.website && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-4 h-4 text-mainColor" />
                      </div>
                      <a
                        href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px]"
                      >
                        {userData.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/profile/${userData.username}/subscriptions`}
              className="block w-full bg-gray-50 dark:bg-thirdColor rounded-b-xl border-t border-gray-200 dark:border-gray-700 px-4 py-3"
            >
              <div className="flex justify-between">
                <div className="text-center">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white hover:underline">
                    {articles.length}
                  </span>
                  <div className="text-xs hover:underline text-gray-500 dark:text-gray-400">Articles</div>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white hover:underline">
                    {userData.subscribers ? userData.subscribers.length : 0}
                  </span>
                  <div className="text-xs hover:underline text-gray-500 dark:text-gray-400">Subscribers</div>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white hover:underline">
                    {userData.subscriptions ? userData.subscriptions.length : 0}
                  </span>
                  <div className="text-xs hover:underline text-gray-500 dark:text-gray-400">Subscriptions</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column - Content Tabs */}
        <div className="md:col-span-2 mt-5">
          {/* Tabs using shadcn/ui */}
          <Tabs defaultValue="articles" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4 h-auto p-1 bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <TabsTrigger
                value="articles"
                className="flex items-center justify-center gap-2 py-3 data-[state=active]:text-mainColor data-[state=active]:border-b-2 data-[state=active]:border-mainColor data-[state=active]:shadow-none data-[state=active]:rounded-none"
              >
                <BookOpen className="w-4 h-4" />
                <span>Articles</span>
              </TabsTrigger>
              <TabsTrigger
                value="upvoted"
                className="flex items-center justify-center gap-2 py-3 data-[state=active]:text-mainColor data-[state=active]:border-b-2 data-[state=active]:border-mainColor data-[state=active]:shadow-none data-[state=active]:rounded-none"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Upvoted</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="articles" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-mainColor" />
                  {isOwnProfile ? "Your Articles" : `${userData.displayname}'s Articles`}
                </h2>
                {isOwnProfile && (
                  <Link
                    href="/add"
                    className="flex items-center gap-1.5 bg-mainColor text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-mainColor/90 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                  </Link>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mainColor"></div>
                </div>
              ) : articles.length === 0 ? (
                <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <User className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {isOwnProfile
                      ? "You haven't published any articles yet. Create your first article to get started!"
                      : `${userData.displayname} hasn't published any articles yet.`}
                  </p>
                  {isOwnProfile && (
                    <Link
                      href="/add"
                      className="mt-5 inline-flex items-center gap-2 bg-mainColor text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-mainColor/90 transition-colors duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Article</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article, i) => (
                    <Article key={i} articleData={article} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upvoted" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-mainColor" />
                  {isOwnProfile ? "Articles You Upvoted" : `Articles ${userData.displayname} Upvoted`}
                </h2>
              </div>

              {isLoadingUpvotes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mainColor"></div>
                </div>
              ) : upvotedArticles.length === 0 ? (
                <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <ArrowUp className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No upvoted articles</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {isOwnProfile
                      ? "Articles you upvote will appear here."
                      : `${userData.displayname} hasn't upvoted any articles yet.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upvotedArticles.map((article, i) => (
                    <Article key={i} articleData={article} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile

