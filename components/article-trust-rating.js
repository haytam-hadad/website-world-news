"use client"

import { useState, useEffect } from "react"
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const TrustRating = ({ articleData }) => {
  const [trustScore, setTrustScore] = useState(0)
  const [trustDetails, setTrustDetails] = useState({
    sourceCredibility: 0,
    voteRatio: 0,
    contentQuality: 0,
    referenceCount: 0,
  })

  // Calculate trust score based on article data
  useEffect(() => {
    if (!articleData) return

    // Extract relevant data
    const { upvote = 0, downvote = 0, content = "", authorusername, views = 0 } = articleData

    // Calculate vote ratio (0-100)
    const totalVotes = upvote + downvote
    const voteRatio = totalVotes > 0 ? Math.round((upvote / totalVotes) * 100) : 50 // Default to neutral if no votes

    // Analyze content quality (basic implementation)
    // Check for references, links, and content length
    const hasReferences = content.includes("http") || content.includes("www")
    const contentLength = content.length
    const contentQuality = Math.min(
      100,
      Math.max(0, (contentLength > 1000 ? 30 : contentLength > 500 ? 20 : 10) + (hasReferences ? 20 : 0)),
    )

    // Count references (links) in content
    const referenceCount = (content.match(/https?:\/\/[^\s]+/g) || []).length

    // Source credibility (placeholder - would be fetched from a database in a real implementation)
    // For demo purposes, we'll use a random value between 50-90
    const sourceCredibility = Math.floor(Math.random() * 40) + 50

    // Calculate overall trust score (weighted average)
    const calculatedScore = Math.round(
      voteRatio * 0.4 + // 40% weight to community votes
        sourceCredibility * 0.3 + // 30% weight to source credibility
        contentQuality * 0.2 + // 20% weight to content quality
        Math.min(referenceCount * 5, 10) * 1, // 10% weight to references (max 10 points)
    )

    setTrustScore(calculatedScore)
    setTrustDetails({
      sourceCredibility,
      voteRatio,
      contentQuality,
      referenceCount,
    })
  }, [articleData])

  // Get appropriate icon and color based on trust score
  const getTrustIcon = () => {
    if (trustScore >= 80) {
      return {
        icon: <ShieldCheck className="w-4 h-4" />,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
      }
    } else if (trustScore >= 60) {
      return {
        icon: <Shield className="w-4 h-4" />,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
      }
    } else if (trustScore >= 40) {
      return {
        icon: <ShieldQuestion className="w-4 h-4" />,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      }
    } else {
      return {
        icon: <ShieldAlert className="w-4 h-4" />,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
      }
    }
  }

  // Get trust label based on score
  const getTrustLabel = () => {
    if (trustScore >= 80) return "Highly Trustworthy"
    if (trustScore >= 60) return "Trustworthy"
    if (trustScore >= 40) return "Moderately Trustworthy"
    return "Low Trustworthiness"
  }

  const { icon, color, bgColor } = getTrustIcon()

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color} ${bgColor} cursor-help`}
          >
            {icon}
            <span>{trustScore}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-3">
          <div className="space-y-2">
            <p className="font-semibold">{getTrustLabel()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This trust rating is calculated based on multiple factors including community votes, source credibility,
              and content analysis.
            </p>
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-xs">
                <span>Community Rating:</span>
                <span className="font-medium">{trustDetails.voteRatio}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    trustDetails.voteRatio >= 70
                      ? "bg-green-500"
                      : trustDetails.voteRatio >= 50
                        ? "bg-blue-500"
                        : trustDetails.voteRatio >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${trustDetails.voteRatio}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span>Source Credibility:</span>
                <span className="font-medium">{trustDetails.sourceCredibility}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    trustDetails.sourceCredibility >= 70
                      ? "bg-green-500"
                      : trustDetails.sourceCredibility >= 50
                        ? "bg-blue-500"
                        : trustDetails.sourceCredibility >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${trustDetails.sourceCredibility}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span>Content Quality:</span>
                <span className="font-medium">{trustDetails.contentQuality}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    trustDetails.contentQuality >= 70
                      ? "bg-green-500"
                      : trustDetails.contentQuality >= 50
                        ? "bg-blue-500"
                        : trustDetails.contentQuality >= 30
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${trustDetails.contentQuality}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span>References:</span>
                <span className="font-medium">{trustDetails.referenceCount}</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

