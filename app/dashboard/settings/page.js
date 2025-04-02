"use client"
import { useState, useContext, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeContext } from "../../ThemeProvider"
import { User, Key, Bell, Sun, Moon, Shield, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { theme, setTheme } = useContext(ThemeContext)
  const [notifications, setNotifications] = useState(true)


  const toggleTheme = () => {
    const newTheme = !theme
    setTheme(newTheme)
  }
  
  return (
    <motion.div
      className="w-full p-2 md:px-10 mx-auto py-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your account preferences and settings</p>
        </div>

        {/* Settings Card */}
        <Card className="bg-white dark:bg-darkgrey border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6 space-y-8">
            {/* Account Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-mainColor" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
              </div>
              <Separator className="my-4" />

              <div className="grid gap-3">
                <Link href="/dashboard/update-info" className="block">
                  <div className="group flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-200 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-mainColor/10 dark:bg-mainColor/20 flex items-center justify-center mr-4 group-hover:bg-mainColor/20 dark:group-hover:bg-mainColor/30 transition-colors">
                        <User className="w-5 h-5 text-mainColor" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-mainColor transition-colors">
                          User Information
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          View and edit your profile details
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-mainColor transition-colors" />
                  </div>
                </Link>

                <Link href="/forgot-password" className="block">
                  <div className="group flex items-center justify-between w-full p-4 rounded-xl text-left transition-all duration-200 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-mainColor/10 dark:bg-mainColor/20 flex items-center justify-center mr-4 group-hover:bg-mainColor/20 dark:group-hover:bg-mainColor/30 transition-colors">
                        <Key className="w-5 h-5 text-mainColor" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-mainColor transition-colors">
                          Change Password
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-mainColor transition-colors" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-mainColor" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferences</h2>
              </div>
              <Separator className="my-4" />

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-mainColor/10 dark:bg-mainColor/20 flex items-center justify-center">
                      {theme ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="theme-toggle" className="text-base font-medium text-gray-900 dark:text-white">
                        Theme
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{theme ? "Light mode" : "Dark mode"}</p>
                    </div>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-mainColor"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-mainColor/10 dark:bg-mainColor/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-mainColor" />
                    </div>
                    <div>
                      <Label
                        htmlFor="notifications-toggle"
                        className="text-base font-medium text-gray-900 dark:text-white"
                      >
                        Notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notifications ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="notifications-toggle"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-mainColor"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

