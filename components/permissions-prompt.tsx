"use client"

import type React from "react"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mic, Camera, Bell, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Permission = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

export function PermissionsPrompt() {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "microphone",
      name: "Microphone",
      description: "For voice chatbot interactions and voice journaling",
      icon: <Mic className="h-5 w-5" />,
      enabled: false,
    },
    {
      id: "camera",
      name: "Camera",
      description: "For emotion tracking via facial expressions (processed locally)",
      icon: <Camera className="h-5 w-5" />,
      enabled: false,
    },
    {
      id: "notifications",
      name: "Notifications",
      description: "For mood check-in reminders and motivational quotes",
      icon: <Bell className="h-5 w-5" />,
      enabled: false,
    },
  ])

  const togglePermission = (id: string) => {
    setPermissions(
      permissions.map((permission) =>
        permission.id === id ? { ...permission, enabled: !permission.enabled } : permission,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-700">Privacy First</h3>
            <p className="text-sm text-blue-600">
              Your data stays on your device. We only use these permissions to provide you with the best experience. You
              can change these settings anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600">{permission.icon}</div>
              <div>
                <Label htmlFor={permission.id} className="font-medium">
                  {permission.name}
                </Label>
                <p className="text-sm text-gray-500">{permission.description}</p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id={permission.id}
                    checked={permission.enabled}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {permission.enabled ? "Disable" : "Enable"} {permission.name.toLowerCase()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        <p>
          You can always change these permissions later in the settings. We value your privacy and never share your data
          with third parties.
        </p>
      </div>
    </div>
  )
}
