"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Loader2, Bell, BellOff } from "lucide-react"

export default function ProfileCard({ profile, currentUser }) {
  // Initialize subscription state
  const [subscriptionState, setSubscriptionState] = useState({
    isSubscribed: false,
    isLoading: false,
  })

  // Check if this is the current user's profile
  const isCurrentUser = currentUser && currentUser._id === profile._id

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!currentUser || isCurrentUser) return

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${profile._id}/subscription-status`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        )

        if (response.ok) {
          const data = await response.json()
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
  }, [currentUser, profile._id, isCurrentUser])

  // Handle subscribe/unsubscribe
  const handleSubscribeToggle = async (e) => {
    e.preventDefault() // Prevent navigation when clicking the button
    e.stopPropagation() // Stop event propagation

    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    setSubscriptionState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${profile._id}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()

        // Update subscription state
        setSubscriptionState({
          isLoading: false,
          isSubscribed: data.subscribed,
        })

        // Update the subscribers count in the profile object
        if (data.subscribed) {
          // Adding a subscriber
          profile.subscribers = (profile.subscribers || 0) + 1
        } else {
          // Removing a subscriber
          profile.subscribers = Math.max((profile.subscribers || 1) - 1, 0)
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

  return (
    <div className="bg-white dark:bg-darkgrey rounded-lg shadow-sm overflow-hidden w-full border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Profile Avatar */}
          <Link
            href={`/profile/${profile.username}`}
            className="relative h-16 w-16 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-md"
          >
            {profile.profilePicture || profile.picture ? (
              <Image
                src={profile.profilePicture || profile.picture || "/placeholder.svg"}
                alt={profile.displayname}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            ) : (
              <span>{profile.displayname?.charAt(0).toUpperCase() || "U"}</span>
            )}

            {/* Verification Badge (if applicable) */}
            {profile.isVerified && (
              <div className="absolute bottom-0 right-0 bg-mainColor rounded-full p-1 w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </Link>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/profile/${profile.username}`} className="hover:underline">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg">{profile.displayname}</h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">{profile.bio}</p>}

            {/* Stats and Subscribe Button */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-6 text-sm">
                <Link
                  href={`/profile/${profile.username}`}
                  className="flex flex-col hover:text-mainColor transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{profile.subscribers || 0}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Subscribers</span>
                </Link>

                <Link
                  href={`/profile/${profile.username}`}
                  className="flex flex-col hover:text-mainColor transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {profile.posts || profile.articles?.length || 0}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
                </Link>
              </div>

              {/* Subscribe Button - Only show if not the current user */}
              {!isCurrentUser && currentUser && (
                <button
                  className={`min-w-[110px] px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    subscriptionState.isSubscribed
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      : "bg-mainColor text-white hover:bg-mainColor/90"
                  } shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-opacity-50`}
                  onClick={handleSubscribeToggle}
                  disabled={subscriptionState.isLoading}
                >
                  {subscriptionState.isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      <span>Loading</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

