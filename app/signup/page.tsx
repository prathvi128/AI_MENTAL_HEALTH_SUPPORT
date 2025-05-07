"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarCreator } from "@/components/avatar-creator"
import { PermissionsPrompt } from "@/components/permissions-prompt"

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "avatar" | "permissions">("info")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    language: "english",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step === "info") {
      setStep("avatar")
    } else if (step === "avatar") {
      setStep("permissions")
    } else {
      // Submit form and redirect to home
      router.push("/home")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            {step === "info" && "Let's get to know you"}
            {step === "avatar" && "Create your wellness companion"}
            {step === "permissions" && "Help us help you better"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "info" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age (for personalized content)</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <select
                  id="language"
                  name="language"
                  className="w-full p-2 border rounded-md"
                  value={formData.language}
                  onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>
            </div>
          )}

          {step === "avatar" && <AvatarCreator />}

          {step === "permissions" && <PermissionsPrompt />}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {step === "permissions" ? "Complete Signup" : "Continue"}
          </Button>

          {step === "info" && (
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </div>
          )}

          {step !== "info" && (
            <Button
              variant="ghost"
              onClick={() => setStep(step === "avatar" ? "info" : "avatar")}
              className="text-gray-500"
            >
              Go Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
