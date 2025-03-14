"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import {
  Bell,
  Heart,
  MessageSquare,
  Repeat,
  Users,
  Filter,
  Radio,
  Zap,
  TrendingUp,
  CheckCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Globe,
  Bookmark,
  AlertCircle,
} from "lucide-react"

// Animation variants for notifications
const notificationVariants = [
  "animate-pulse bg-blue-50 dark:bg-blue-900/20",
  "animate-pulse bg-green-50 dark:bg-green-900/20",
  "animate-pulse bg-yellow-50 dark:bg-yellow-900/20",
  "animate-pulse bg-purple-50 dark:bg-purple-900/20",
  "animate-pulse bg-pink-50 dark:bg-pink-900/20",
]

// Notification types with their respective icons and colors
const notificationTypes = {
  like: { icon: Heart, color: "text-red-500" },
  comment: { icon: MessageSquare, color: "text-blue-500" },
  mention: { icon: Users, color: "text-green-500" },
  repost: { icon: Repeat, color: "text-purple-500" },
  follow: { icon: Users, color: "text-yellow-500" },
  bookmark: { icon: Bookmark, color: "text-indigo-500" },
  alert: { icon: AlertCircle, color: "text-orange-500" },
}

// Sample notification data
const sampleNotifications = [
  {
    id: 1,
    type: "like",
    user: "Sarah Johnson",
    username: "sarahj",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "liked your post about climate change",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: "Michael Chen",
    username: "mchen",
    avatar: "/placeholder.svg?height=40&width=40",
    content: 'commented on your article: "Great insights on this topic!"',
    time: "15m ago",
    read: false,
  },
  {
    id: 3,
    type: "mention",
    user: "Alex Rivera",
    username: "arivera",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "mentioned you in a comment",
    time: "1h ago",
    read: false,
  },
  {
    id: 4,
    type: "repost",
    user: "Jamie Smith",
    username: "jsmith",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "shared your article on renewable energy",
    time: "3h ago",
    read: true,
  },
  {
    id: 5,
    type: "follow",
    user: "Taylor Wilson",
    username: "twilson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "started following you",
    time: "5h ago",
    read: true,
  },
  {
    id: 6,
    type: "bookmark",
    user: "System",
    content: 'Your bookmarked story "The Future of AI" is trending',
    time: "1d ago",
    read: true,
  }
]

// Sample channels data
const sampleChannels = [
  {
    id: 1,
    name: "World News",
    icon: Globe,
    subscribers: "2.3M",
    category: "News",
    isSubscribed: true,
    isVerified: true,
    newContent: true,
  },
  {
    id: 2,
    name: "Tech Insights",
    icon: Zap,
    subscribers: "1.5M",
    category: "Technology",
    isSubscribed: true,
    isVerified: true,
    newContent: true,
  },
  {
    id: 3,
    name: "Climate Action",
    icon: Globe,
    subscribers: "985K",
    category: "Environment",
    isSubscribed: false,
    isVerified: true,
    newContent: false,
  },
  {
    id: 4,
    name: "Financial Times",
    icon: TrendingUp,
    subscribers: "1.8M",
    category: "Finance",
    isSubscribed: false,
    isVerified: true,
    newContent: false,
  }
]

// Notification component
const Notification = ({ data, onMarkAsRead, onRemove }) => {
  const NotificationIcon = notificationTypes[data.type]?.icon || Bell
  const iconColor = notificationTypes[data.type]?.color || "text-gray-500"

  return (
    <div
      className={`p-2 rounded-lg mb-2 transition-all duration-300 ${data.read ? "bg-transparent" : "bg-gray-50 dark:bg-gray-800/50"}`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative mt-0.5">
          <div
            className={`p-2 rounded-full ${data.read ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-600"}`}
          >
            <NotificationIcon className={`w-4 h-4 ${iconColor}`} />
          </div>
          {!data.read && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-mainColor rounded-full border-2 border-white dark:border-darkgrey"></span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              {data.user && (
                <div className="flex items-center space-x-1 mb-1">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{data.user}</span>
                  {data.username && <span className="text-xs text-gray-500 dark:text-gray-400">@{data.username}</span>}
                </div>
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300">{data.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.time}</p>
            </div>

            <div className="flex space-x-1">
              {!data.read && (
                <button
                  onClick={() => onMarkAsRead(data.id)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Mark as read"
                >
                  <CheckCircle size={16} />
                </button>
              )}
              <button
                onClick={() => onRemove(data.id)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Remove notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Channel subscription component
const ChannelItem = ({ channel, onToggleSubscription }) => {
  const ChannelIcon = channel.icon

  return (
    <div
      className={`p-2 rounded-lg mb-2 transition-all duration-300 ${
        channel.newContent && channel.isSubscribed
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-full ${
              channel.isSubscribed
                ? "bg-mainColor text-secondaryColor"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            }`}
          >
            <ChannelIcon className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center space-x-1">
              <p className="font-medium text-gray-900 dark:text-gray-100">{channel.name}</p>
              {channel.isVerified && <CheckCircle size={14} className="text-blue-500" />}
              {channel.newContent && channel.isSubscribed && (
                <span className="px-1.5 py-0.5 text-xs bg-mainColor text-secondaryColor rounded-full">New</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{channel.subscribers} subscribers</span>
              <span>•</span>
              <span>{channel.category}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggleSubscription(channel.id)}
          className={`p-1.5 rounded-full ${
            channel.isSubscribed
              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              : "bg-mainColor text-secondaryColor"
          }`}
          aria-label={channel.isSubscribed ? "Unsubscribe" : "Subscribe"}
        >
          {channel.isSubscribed ? <CheckCircle size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </div>
  )
}

// Filter tabs component
const FilterTabs = ({ activeTab, tabs, onChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// Section header component
const SectionHeader = ({ icon, title, action, isExpanded, onToggle }) => {
  const Icon = icon

  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-mainColor mr-2" />
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {action ? (
        action
      ) : (
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      )}
    </div>
  )
}

// Main RightSidebar component
const RightSidebar = () => {
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [channels, setChannels] = useState(sampleChannels)
  const [notificationTab, setNotificationTab] = useState("all")
  const [channelTab, setChannelTab] = useState("subscribed")
  const [expandedSections, setExpandedSections] = useState({
    notifications: true,
    channels: true,
  })

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (notificationTab === "all") return true
    if (notificationTab === "unread") return !notification.read
    return notification.type === notificationTab
  })

  // Filter channels based on active tab
  const filteredChannels = channels.filter((channel) => {
    if (channelTab === "all") return true
    if (channelTab === "subscribed") return channel.isSubscribed
    if (channelTab === "trending") return channel.subscribers > "1M"
    return channel.category.toLowerCase() === channelTab
  })

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Toggle channel subscription
  const toggleSubscription = (id) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, isSubscribed: !channel.isSubscribed } : channel)),
    )
  }

  // Simulate new notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sampleNotifications.length)
      const randomNotification = {
        ...sampleNotifications[randomIndex],
        id: Date.now(),
        time: "just now",
        read: false,
      }

      if (notifications.length < 15) {
        setNotifications((prev) => [randomNotification, ...prev])
      }
    }, 30000) // Add a new notification every 30 seconds

    return () => clearInterval(interval)
  }, [notifications])

  // Notification filter tabs
  const notificationTabs = [
    { id: "all", label: "All" },
 
    { id: "mention", label: "Mentions" },
    { id: "like", label: "Likes" },
  ]

  // Channel filter tabs
  const channelTabs = [
    { id: "subscribed", label: "My Channels" },
    { id: "trending", label: "Trending" },
    { id: "all", label: "Discover" },
  ]

  return (
    <div className="w-full h-full mb-5 bg-white dark:bg-darkgrey border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-3 space-y-4">
        {/* Notification Center */}
        <div>
          <SectionHeader
            icon={Bell}
            title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ""}`}
            isExpanded={expandedSections.notifications}
            onToggle={() => toggleSection("notifications")}
            action={
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                aria-label="Filter notifications"
              >
                <Filter size={18} />
              </button>
            }
          />

          {expandedSections.notifications && (
            <>
              <FilterTabs activeTab={notificationTab} tabs={notificationTabs} onChange={setNotificationTab} />

              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <Notification
                      key={notification.id}
                      data={notification}
                      onMarkAsRead={markAsRead}
                      onRemove={removeNotification}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No notifications to show</p>
                  </div>
                )}
              </div>

              {filteredNotifications.length > 0 && (
                <div className="mt-2 text-center">
                  <Link href="/notifications" className="text-mainColor text-sm font-medium hover:underline">
                    View all notifications
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Channel Subscriptions */}
        <div>
          <SectionHeader
            icon={Radio}
            title="Subscribed Channels"
            isExpanded={expandedSections.channels}
            onToggle={() => toggleSection("channels")}
          />

          {expandedSections.channels && (
            <>
              <FilterTabs activeTab={channelTab} tabs={channelTabs} onChange={setChannelTab} />

              <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredChannels.length > 0 ? (
                  filteredChannels.map((channel) => (
                    <ChannelItem key={channel.id} channel={channel} onToggleSubscription={toggleSubscription} />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Radio className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No channels to show</p>
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <Link href="/channels/discover" className="text-mainColor text-sm font-medium hover:underline">
                  Browse all channels
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-2">
            <Link href="/help" className="hover:underline">
              Help Center
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
          </div>
          <p className="mt-2">© {new Date().getFullYear()} World News</p>        
        </div>
      </div>
    </div>
  )
}

export default RightSidebar

