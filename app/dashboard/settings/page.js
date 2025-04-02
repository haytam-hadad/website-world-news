"use client"
import { useState, useContext } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeContext } from "../../ThemeProvider"
import { User, Key, Bell, Sun, Moon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {

  const { theme, setTheme } = useContext(ThemeContext)
  const [notifications, setNotifications] = useState(true)

  const toggleTheme = () => {
    const newTheme = !theme
    setTheme(newTheme)

    // Apply theme class to document for immediate visual feedback
    if (newTheme) {
      document.documentElement.classList.add("true")
    } else {
      document.documentElement.classList.remove("true")
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", newTheme ? "true" : "false")
  }

  return (
    <motion.div
      className="w-full p-2 md:px-10 py-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
        </div>

        {/* Settings Card */}
        <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 space-y-6">
            {/* Account Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account</h2>

              <div className="grid gap-3">
                <Link href="/dashboard/update-info">
                  <button className="w-full p-3 rounded-lg justify-start h-auto py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="w-4 h-4 mr-3 text-mainColor" />
                    <div>
                      <span className="font-medium">User Information</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        View and edit your profile details
                      </p>
                    </div>
                  </button>
                </Link>

                <Link href="/forgot-password">
                  <button className="w-full p-3 rounded-lg justify-start h-auto py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Key className="w-4 h-4 mr-3 text-mainColor" />
                    <div>
                      <span className="font-medium">Change Password</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your password</p>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {theme ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{theme ? "Light mode" : "Dark mode"}</p>
                    </div>
                  </div>
                  <Switch
                  id="dark-mode"
                  checked={theme}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-mainColor"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-mainColor" />
                    <div>
                      <Label className="text-base">Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications</p>
                    </div>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

