"use client"

import { useState, useEffect, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Bell, BellOff } from "lucide-react"
import { ThemeContext } from "../app/ThemeProvider"

export default function ProfileCard({ profile, currentUser }) {
  const [subscriptionState, setSubscriptionState] = useState({
    isSubscribed: false,
    isLoading: false,
  })
  const { user } = useContext(ThemeContext)

  // Extract the correct ID from the profile object
  const getProfileId = () => {
    // Handle different ID formats
    if (profile?._id) {
      return profile._id
    } else if (profile?.id) {
      return profile.id
    } else if (profile?._id?.$oid) {
      return profile._id.$oid
    } else if (typeof profile === "string") {
      return profile
    }

    // If we can't find an ID, log an error and return null
    console.error("Could not find ID in profile object:", profile)
    return null
  }

  const profileId = getProfileId()

  // Check if this is the current user's profile
  const isOwnProfile = user && profileId && user._id === profileId

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user || !profileId || isOwnProfile) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/subscription-status`, {
          method: "GET",
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
          }))
        }
      } catch (error) {
        console.error("Error checking subscription status:", error)
      }
    }

    checkSubscriptionStatus()
  }, [user, profileId, isOwnProfile])

  const toggleSubscribe = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!user) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    // Check if profileId exists and is valid
    if (!profileId) {
      console.error("Cannot toggle subscription: Invalid profile ID")
      return
    }

    try {
      setSubscriptionState((prev) => ({ ...prev, isLoading: true }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${profileId}/subscribe`, {
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
          if (Array.isArray(profile.subscribers)) {
            profile.subscribers = [
              ...profile.subscribers,
              {
                userId: user._id,
                userModel: user.isGoogleUser ? "Googleuser" : "User",
              },
            ]
          } else {
            // If subscribers is a number, increment it
            profile.subscribers = (typeof profile.subscribers === "number" ? profile.subscribers : 0) + 1
          }
        } else {
          // Removing a subscriber
          if (Array.isArray(profile.subscribers)) {
            profile.subscribers = profile.subscribers.filter((sub) => {
              if (typeof sub === "object" && sub !== null) {
                return sub.userId?.$oid !== user._id && sub.userId !== user._id
              }
              return true
            })
          } else {
            // If subscribers is a number, decrement it
            profile.subscribers = Math.max((typeof profile.subscribers === "number" ? profile.subscribers : 1) - 1, 0)
          }
        }
      } else {
        // More robust error handling
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          console.error("Error toggling subscription:", errorData)
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        console.error(errorMessage)
        setSubscriptionState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error("Network or other error toggling subscription:", error)
      setSubscriptionState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // Get username safely
  const getUsername = () => {
    return profile?.username || "user"
  }

  // Get display name safely
  const getDisplayName = () => {
    return profile?.displayname || profile?.name || getUsername() || "User"
  }

  // Get profile picture safely
  const getProfilePicture = () => {
    return profile?.profilePicture || profile?.picture || profile?.avatar || null
  }

  return (
    <Link
      href={`/profile/${getUsername()}`}
      className="block bg-white my-2 dark:bg-darkgrey rounded-lg shadow-sm overflow-hidden w-full border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Profile Avatar */}
          {getProfilePicture() ? (
            <div className="rounded-full overflow-hidden w-10 h-10">
              <Image
                src={getProfilePicture() || "/placeholder.svg"}
                alt={getDisplayName()}
                className="h-full w-full object-cover"
                width={40}
                height={40}
              />
            </div>
          ) : (
            <div className="rounded-full bg-mainColor w-full h-full flex items-center justify-center text-white font-semibold">
              {getDisplayName().charAt(0).toUpperCase()}
            </div>
          )}

          {/* Profile Info */}
          <div className="flex-1 min-w-0 flex justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg">{getDisplayName()}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{getUsername()}</p>
              {/* Bio */}
              {profile?.bio && (
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">{profile.bio}</p>
              )}
            </div>
          </div>

          {/* Subscribe Button - Only show if not the current user and we have a valid profile ID */}
          {!isOwnProfile && user && profileId && (
            <button
              onClick={toggleSubscribe}
              disabled={subscriptionState.isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 ${
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
        </div>
      </div>
    </Link>
  )
}

