"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { UserAvatar } from "@/components/user-avatar"
import { AvatarCreator } from "@/components/avatar-creator"
import { PermissionsPrompt } from "@/components/permissions-prompt"
import { User, Bell, Shield, Trash, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [userData, setUserData] = useState({
    username: "wellness_user",
    email: "user@example.com",
    language: "english",
    age: "25",
  })

  const [notifications, setNotifications] = useState({
    moodReminders: true,
    quotes: true,
    streakUpdates: true,
    emailDigest: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name: string) => {
    setNotifications((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="text-xl text-center text-blue-700">Settings</CardTitle>
            <CardDescription className="text-center">Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="avatar" className="flex items-center gap-2">
                  <UserAvatar className="h-4 w-4" />
                  <span>Avatar</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-2">
                    <UserAvatar className="w-24 h-24" />
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" value={userData.username} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <select
                          id="language"
                          name="language"
                          className="w-full p-2 border rounded-md"
                          value={userData.language}
                          onChange={(e) => setUserData((prev) => ({ ...prev, language: e.target.value }))}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="japanese">Japanese</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" name="age" type="number" value={userData.age} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter your current password" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="Enter new password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                      </div>
                    </div>

                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="avatar">
                <AvatarCreator />

                <div className="flex justify-center mt-6">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Save Avatar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Daily Mood Check-in Reminders</h3>
                      <p className="text-sm text-gray-500">Receive a reminder to check in with your mood</p>
                    </div>
                    <Switch
                      checked={notifications.moodReminders}
                      onCheckedChange={() => handleNotificationToggle("moodReminders")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Motivational Quotes</h3>
                      <p className="text-sm text-gray-500">Receive daily inspirational quotes</p>
                    </div>
                    <Switch checked={notifications.quotes} onCheckedChange={() => handleNotificationToggle("quotes")} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Streak Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about your check-in streak</p>
                    </div>
                    <Switch
                      checked={notifications.streakUpdates}
                      onCheckedChange={() => handleNotificationToggle("streakUpdates")}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Email Digest</h3>
                      <p className="text-sm text-gray-500">Receive a weekly summary of your mood patterns</p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={() => handleNotificationToggle("emailDigest")}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-2">Notification Time</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                      <Input id="reminder-time" type="time" defaultValue="09:00" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quote-time">Quote Delivery Time</Label>
                      <Input id="quote-time" type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Save Notification Settings
                </Button>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">App Permissions</h3>
                  <PermissionsPrompt />
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium">Data & Privacy</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Data Storage</h4>
                        <p className="text-sm text-gray-500">Choose where your data is stored</p>
                      </div>
                      <select className="p-2 border rounded-md">
                        <option value="local">Local Only</option>
                        <option value="cloud">Cloud Backup</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Analytics</h4>
                        <p className="text-sm text-gray-500">Allow anonymous usage data collection</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      Export My Data
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                      Delete My Account
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
