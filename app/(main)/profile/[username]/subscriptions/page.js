"use client"

import Link from "next/link"

import { useState, useEffect, useContext } from "react"
import { use } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileCard from "@/components/profile-card"
import { UserRound, Users, Loader2, AlertCircle, FileText } from "lucide-react"
import { ThemeContext } from "@/app/ThemeProvider"

export default function Page({ params }) {
  // Unwrap params using React.use() as required in Next.js 15
  const unwrappedParams = use(params)
  const { username } = unwrappedParams

  const [userProfile, setUserProfile] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("subscriptions")
  const [error, setError] = useState(null)
  const { user } = useContext(ThemeContext)

  // Fetch user profile for display purposes only
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/${username}`, {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        } else {
          console.error("Failed to fetch user profile:", response.status)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [username])

  // Fetch subscriptions and subscribers directly using username
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

  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  if (error && error === "User not found") {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The user "{username}" could not be found.</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-1 sm:p-3">
      <h1 className="text-lg p-3 md:text-xl font-semibold mb-3">@{username}</h1>
        
      <Tabs defaultValue="subscriptions" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid text-mainColor w-full grid-cols-2 mb-8">
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <span>subscriptions</span>
            {!isLoading && (
              <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                {subscriptions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>subscribed</span>
            {!isLoading && (
              <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                {subscribers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          {isLoading ? (
            <LoadingState />
          ) : error && error !== "User not found" ? (
            <ErrorState message={error} />
          ) : subscriptions.length === 0 ? (
            <EmptyState
              message={`${userProfile?.displayname || username} is not following anyone yet`}
              type="subscriptions"
            />
          ) : (
            <div className="flex-col gap-4">
              {subscriptions.map((subscription) => (
                <ProfileCard
                  key={subscription._id || subscription.id || subscription.userId}
                  profile={subscription}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscribers">
          {isLoading ? (
            <LoadingState />
          ) : error && error !== "User not found" ? (
            <ErrorState message={error} />
          ) : subscribers.length === 0 ? (
            <EmptyState message={`${userProfile?.displayname || username} has no followers yet`} type="subscribers" />
          ) : (
            <div className="flex-col gap-4">
              {subscribers.map((subscriber) => (
                <ProfileCard key={subscriber._id} profile={subscriber} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-mainColor animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Loading connections...</p>
    </div>
  )
}

function EmptyState({ message, type }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {type === "subscriptions" ? (
        <UserRound className="h-12 w-12 text-gray-400 mb-4" />
      ) : (
        <Users className="h-12 w-12 text-gray-400 mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{message}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {type === "subscriptions"
          ? "Following will appear here when they start following others."
          : "Followers will appear here when others start following them."}
      </p>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center">
      <p className="text-red-800 dark:text-red-300">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
      >
        Try again
      </button>
    </div>
  )
}

