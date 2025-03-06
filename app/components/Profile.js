"use client"
import { useContext, useEffect, useState } from "react"
import {
  Bell,
  BellOff,
  Edit,
  Star,
  Mail,
  Plus,
  Calendar,
  MapPin,
  LinkIcon,
  Briefcase,
  User,
  ImageIcon,
} from "lucide-react"
import Article from "./Article"
import { ThemeContext } from "../ThemeProvider"
import Link from "next/link"
import { motion } from "framer-motion"

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?username=${username}`)
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Banner Section */}
      <div className="relative w-full h-40 sm:h-52 rounded-xl mb-16 bg-gradient-to-r from-mainColor to-sky-400">
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
              <div className="w-full h-full rounded-full bg-mainColor shadow-md flex items-center justify-center text-white font-bold text-4xl">
                {userData.displayname?.charAt(0).toUpperCase() || "U"}
              </div>
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pt-2 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="ml-2 sm:ml-32 mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {userData.displayname || "Unknown"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">@{userData.username || "username"}</p>
        </div>

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
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left Column - User Info */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>

              <div className="space-y-4">
                {userData.bio && <p className="text-gray-700 dark:text-gray-300">{userData.bio}</p>}

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>{userData.email || "No email available"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Joined {formatDate(userData.createdAt)}</span>
                  </div>

                  {userData.location && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>{userData.location}</span>
                    </div>
                  )}

                  {userData.website && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                      <LinkIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <a
                        href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {userData.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  {userData.occupation && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>{userData.occupation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-3">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{articles.length}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content Tabs */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("articles")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "articles"
                    ? "border-mainColor text-mainColor"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab("liked")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "liked"
                    ? "border-mainColor text-mainColor"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Liked
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "saved"
                    ? "border-mainColor text-mainColor"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Saved
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
                </div>
              ) : articles.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <User className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No articles yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {isOwnProfile
                      ? "You haven't published any articles yet. Create your first article to get started!"
                      : `${userData.displayname} hasn't published any articles yet.`}
                  </p>
                  {isOwnProfile && (
                    <Link
                      href="/add"
                      className="mt-4 inline-flex items-center gap-1.5 bg-mainColor text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-mainColor/90 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Article</span>
                    </Link>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {articles.map((article, i) => (
                    <Article key={i} articleData={article} />
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {activeTab === "liked" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Star className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No liked articles</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile
                  ? "Articles you like will appear here."
                  : `${userData.displayname} hasn't liked any articles yet.`}
              </p>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No saved articles</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile
                  ? "Articles you save will appear here for easy access later."
                  : `${userData.displayname} hasn't saved any articles yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

