"use client"
import { useContext, useEffect, useState } from "react"
import {
  Bell,
  BellOff,
  Edit,
  Star,
  Plus,
  Calendar,
  LinkIcon,
  Briefcase,
  User,
  ImageIcon,
  Cake,
  BookOpen,
  Heart,
  Bookmark,
} from "lucide-react"
import Article from "./Article"
import { ThemeContext } from "../app/ThemeProvider"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"


const Profile = ({ userData }) => {
  const [articles, setArticles] = useState([])
  const [subscribed, setSubscribed] = useState(false)
  const [activeTab, setActiveTab] = useState("articles")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useContext(ThemeContext)

  const isOwnProfile = user && user._id === userData._id

  const toggleSubscribe = () => {
    setSubscribed(!subscribed)
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Tab icons mapping
  const tabIcons = {
    articles: <BookOpen className="w-4 h-4" />,
    liked: <Heart className="w-4 h-4" />,
    saved: <Bookmark className="w-4 h-4" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.5, 0, 0.5, 1] }}
      className="w-full mx-auto"
    >
      {/* Banner Section */}
      <div className="relative w-full h-40 sm:h-52 rounded-xl mb-16 bg-gradient-to-r from-mainColor to-main2Color shadow-md">
        {isOwnProfile && (
          <button
            type="button"
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 px-3 py-2 text-sm font-medium rounded-lg shadow-md transition-colors duration-200"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Change Banner</span>
          </button>
        )}

        {/* Profile Avatar - Positioned to overlap banner and content */}
        <div className="absolute z-20 -bottom-12 left-6 sm:left-8">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-md">
              {userData.picture ? (
                <Image
                  src={userData.picture}
                  alt={userData.displayname}
                  className="w-full h-full rounded-full shadow-inner"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-mainColor to-main2Color shadow-inner flex items-center justify-center text-white font-bold text-4xl">
                  {userData.displayname?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-mainColor hover:bg-gray-100 transition-colors duration-200">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between p-1 pb-3">
        <div className="ml-2 sm:ml-32 mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {userData.displayname || "Unknown"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">@{userData.username || "username"}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {isOwnProfile ? (
            <Link
              href="/update-info"
              className="flex items-center gap-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 font-medium transition-colors duration-200 shadow-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            <button
              onClick={toggleSubscribe}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                subscribed
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                  : "bg-mainColor text-white hover:bg-mainColor/90"
              }`}
            >
              {subscribed ? (
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
      <div className="grid grid-cols-1 gap-3 mt-4">
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

            <div className="bg-gray-50 dark:bg-thirdColor rounded-b-xl border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">{articles.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content Tabs */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden">
            <nav className="flex">
              {["articles", "liked", "saved"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-1 font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab
                      ? "border-b-2 border-mainColor text-mainColor"
                      : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tabIcons[tab]}
                  <span className="capitalize">{tab}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "articles" && (
              <motion.div
                key="articles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
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
              </motion.div>
            )}

            {activeTab === "liked" && (
              <motion.div
                key="liked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <Star className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No liked articles</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {isOwnProfile
                      ? "Articles you like will appear here."
                      : `${userData.displayname} hasn't liked any articles yet.`}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "saved" && (
              <motion.div
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <Briefcase className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved articles</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {isOwnProfile
                      ? "Articles you save will appear here for easy access later."
                      : `${userData.displayname} hasn't saved any articles yet.`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile

