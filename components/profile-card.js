"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ProfileCard({ profile, currentUser }) {
  // Initialize subscription state based on API data (using random for demo)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isCurrentUser = currentUser && currentUser.username === profile.username



  return (
    <Link href={`/profile/${profile.username}`} className="block w-full">
      <div className="bg-white dark:bg-darkgrey rounded-lg shadow-sm overflow-hidden w-full border border-gray-100 dark:border-gray-700 hover:shadow-md">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Profile Avatar */}
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-mainColor flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-md">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture || "/placeholder.svg"}
                  alt={profile.displayname}
                  className="h-full w-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                profile.displayname.charAt(0).toUpperCase()
              )}

              {/* Verification Badge (if applicable) */}
              {profile.isVerified && (
                <div className="absolute bottom-0 right-0 bg-mainColor rounded-full p-1 w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg">{profile.displayname}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">{profile.bio}</p>
              )}

              {/* Stats and Subscribe Button */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {profile.subscribers || Math.floor(Math.random() * 1000)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Subscribers</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {profile.posts || Math.floor(Math.random() * 50)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
                  </div>
                </div>

                {/* Subscribe Button - Only show if not the current user */}
                {!isCurrentUser && (
                  <button
                    className={`min-w-[110px] px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isSubscribed
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-mainColor text-white hover:bg-mainColor/90"
                    } shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-opacity-50`}
                    onClick={() => {setIsSubscribed(!isSubscribed)}}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        <span>Loading</span>
                      </span>
                    ) : isSubscribed ? (
                      "Unsubscribe"
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

