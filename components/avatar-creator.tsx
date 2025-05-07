"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type AvatarFeature = {
  id: string
  name: string
  options: string[]
}

const AVATAR_FEATURES: AvatarFeature[] = [
  {
    id: "face",
    name: "Face Shape",
    options: ["Round", "Oval", "Square", "Heart"],
  },
  {
    id: "hair",
    name: "Hair Style",
    options: ["Short", "Medium", "Long", "Curly", "Wavy", "Bald", "Ponytail", "Bun"],
  },
  {
    id: "eyes",
    name: "Eye Shape",
    options: ["Round", "Almond", "Hooded", "Wide", "Narrow"],
  },
  {
    id: "skin",
    name: "Skin Tone",
    options: ["Light", "Medium", "Tan", "Dark", "Olive", "Golden"],
  },
  {
    id: "outfit",
    name: "Outfit Style",
    options: ["Casual", "Professional", "Sporty", "Formal", "Relaxed"],
  },
  {
    id: "accessory",
    name: "Accessories",
    options: ["None", "Glasses", "Hat", "Earrings", "Headband", "Scarf"],
  },
  {
    id: "expression",
    name: "Expression",
    options: ["Smile", "Neutral", "Wink", "Laugh", "Serious"],
  },
]

const COLORS = [
  "bg-amber-200",
  "bg-amber-600",
  "bg-orange-300",
  "bg-red-300",
  "bg-pink-300",
  "bg-purple-300",
  "bg-blue-300",
  "bg-teal-300",
  "bg-green-300",
  "bg-yellow-300",
  "bg-gray-300",
  "bg-gray-600",
  "bg-black",
  "bg-white",
]

export function AvatarCreator() {
  const [activeTab, setActiveTab] = useState("features")
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string>>({
    face: "Round",
    hair: "Short",
    eyes: "Round",
    skin: "Light",
    outfit: "Casual",
    accessory: "None",
    expression: "Smile",
  })
  const [hairColor, setHairColor] = useState("bg-amber-600")
  const [eyeColor, setEyeColor] = useState("bg-blue-300")
  const [outfitColor, setOutfitColor] = useState("bg-blue-300")
  const [avatarSize, setAvatarSize] = useState([80])

  const handleFeatureChange = (featureId: string, value: string) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureId]: value,
    }))
  }

  // Preview the avatar with current settings
  const renderAvatarPreview = () => (
    <div className="relative">
      <div
        className="rounded-full overflow-hidden border-4 border-white shadow-lg"
        style={{ width: `${avatarSize[0]}px`, height: `${avatarSize[0]}px` }}
      >
        <div
          className={`w-full h-full flex items-center justify-center ${
            selectedFeatures.skin === "Light"
              ? "bg-amber-200"
              : selectedFeatures.skin === "Medium"
                ? "bg-amber-300"
                : selectedFeatures.skin === "Tan"
                  ? "bg-amber-400"
                  : selectedFeatures.skin === "Dark"
                    ? "bg-amber-700"
                    : selectedFeatures.skin === "Olive"
                      ? "bg-yellow-700"
                      : "bg-yellow-500"
          }`}
        >
          {/* Eyes */}
          <div className="absolute" style={{ top: `${avatarSize[0] * 0.35}px` }}>
            <div className="flex justify-center space-x-4">
              <div className={`w-4 h-2 ${eyeColor} rounded-full`}></div>
              <div className={`w-4 h-2 ${eyeColor} rounded-full`}></div>
            </div>
          </div>

          {/* Mouth based on expression */}
          <div className="absolute" style={{ bottom: `${avatarSize[0] * 0.3}px` }}>
            {selectedFeatures.expression === "Smile" && <div className="w-8 h-3 bg-red-300 rounded-full"></div>}
            {selectedFeatures.expression === "Neutral" && <div className="w-6 h-1 bg-red-300 rounded-full"></div>}
            {selectedFeatures.expression === "Wink" && (
              <div className="w-8 h-3 bg-red-300 rounded-full transform rotate-12"></div>
            )}
            {selectedFeatures.expression === "Laugh" && <div className="w-8 h-4 bg-red-300 rounded-full"></div>}
            {selectedFeatures.expression === "Serious" && (
              <div className="w-6 h-1 bg-red-300 rounded-full transform -rotate-12"></div>
            )}
          </div>

          {/* Hair */}
          <div
            className={`absolute ${hairColor} rounded-t-full`}
            style={{
              top: `-${avatarSize[0] * 0.05}px`,
              width: `${avatarSize[0] * 0.8}px`,
              height: `${
                selectedFeatures.hair === "Bald"
                  ? 0
                  : selectedFeatures.hair === "Short"
                    ? avatarSize[0] * 0.2
                    : selectedFeatures.hair === "Medium"
                      ? avatarSize[0] * 0.3
                      : avatarSize[0] * 0.4
              }px`,
            }}
          ></div>

          {/* Accessories */}
          {selectedFeatures.accessory === "Glasses" && (
            <div
              className="absolute border-2 border-gray-600 rounded-full"
              style={{
                top: `${avatarSize[0] * 0.35}px`,
                width: `${avatarSize[0] * 0.6}px`,
                height: `${avatarSize[0] * 0.2}px`,
              }}
            ></div>
          )}
          {selectedFeatures.accessory === "Hat" && (
            <div
              className={`absolute ${outfitColor} rounded-t-full`}
              style={{
                top: `-${avatarSize[0] * 0.2}px`,
                width: `${avatarSize[0] * 0.9}px`,
                height: `${avatarSize[0] * 0.3}px`,
              }}
            ></div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-center">{renderAvatarPreview()}</div>

      <div className="space-y-2">
        <Label>Avatar Size</Label>
        <Slider value={avatarSize} min={60} max={120} step={1} onValueChange={setAvatarSize} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4 mt-4">
          {AVATAR_FEATURES.map((feature) => (
            <div key={feature.id} className="space-y-2">
              <Label>{feature.name}</Label>
              <RadioGroup
                value={selectedFeatures[feature.id]}
                onValueChange={(value) => handleFeatureChange(feature.id, value)}
                className="flex flex-wrap gap-2"
              >
                {feature.options.map((option) => (
                  <div key={option} className="flex items-center space-x-1">
                    <RadioGroupItem id={`${feature.id}-${option}`} value={option} />
                    <Label htmlFor={`${feature.id}-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Hair Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${hairColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                  onClick={() => setHairColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Eye Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${eyeColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                  onClick={() => setEyeColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Outfit Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${color} ${outfitColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                  onClick={() => setOutfitColor(color)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Expression</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFeatures.expression === "Smile" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("expression", "Smile")}
              >
                😊 Smile
              </Button>
              <Button
                variant={selectedFeatures.expression === "Neutral" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("expression", "Neutral")}
              >
                😐 Neutral
              </Button>
              <Button
                variant={selectedFeatures.expression === "Wink" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("expression", "Wink")}
              >
                😉 Wink
              </Button>
              <Button
                variant={selectedFeatures.expression === "Laugh" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("expression", "Laugh")}
              >
                😄 Laugh
              </Button>
              <Button
                variant={selectedFeatures.expression === "Serious" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("expression", "Serious")}
              >
                😑 Serious
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accessories</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFeatures.accessory === "None" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("accessory", "None")}
              >
                None
              </Button>
              <Button
                variant={selectedFeatures.accessory === "Glasses" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("accessory", "Glasses")}
              >
                Glasses
              </Button>
              <Button
                variant={selectedFeatures.accessory === "Hat" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("accessory", "Hat")}
              >
                Hat
              </Button>
              <Button
                variant={selectedFeatures.accessory === "Earrings" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("accessory", "Earrings")}
              >
                Earrings
              </Button>
              <Button
                variant={selectedFeatures.accessory === "Headband" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFeatureChange("accessory", "Headband")}
              >
                Headband
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
