"use client"

import type React from "react"

import { useState } from "react"
import type { BrandingOptions } from "@/types/invoice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Trash2 } from "lucide-react"

interface BrandingSectionProps {
  brandingOptions: BrandingOptions
  setBrandingOptions: React.Dispatch<React.SetStateAction<BrandingOptions>>
}

export default function BrandingSection({ brandingOptions, setBrandingOptions }: BrandingSectionProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(brandingOptions.logo)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setLogoPreview(result)
        setBrandingOptions((prev) => ({
          ...prev,
          logo: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setBrandingOptions((prev) => ({
      ...prev,
      logo: null,
    }))
  }

  const handleLogoWidthChange = (value: number[]) => {
    setBrandingOptions((prev) => ({
      ...prev,
      logoWidth: value[0],
    }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBrandingOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFontChange = (value: string) => {
    setBrandingOptions((prev) => ({
      ...prev,
      fontFamily: value,
    }))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Branding</h2>

        <div className="space-y-6">
          <div>
            <Label className="mb-2 block">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center">No logo uploaded</span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Upload Logo
                  </Button>

                  {logoPreview && (
                    <Button type="button" variant="destructive" onClick={handleRemoveLogo}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  )}
                </div>

                <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />

                <div className="text-sm text-gray-500">Recommended: PNG or JPG with transparent background</div>
              </div>
            </div>
          </div>

          {logoPreview && (
            <div>
              <div className="flex justify-between mb-2">
                <Label>Logo Width</Label>
                <span>{brandingOptions.logoWidth}px</span>
              </div>
              <Slider
                min={50}
                max={300}
                step={10}
                value={[brandingOptions.logoWidth]}
                onValueChange={handleLogoWidthChange}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2 mt-1">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: brandingOptions.primaryColor }}
                />
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={brandingOptions.primaryColor}
                  onChange={handleColorChange}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2 mt-1">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: brandingOptions.secondaryColor }}
                />
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={brandingOptions.secondaryColor}
                  onChange={handleColorChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h4 className="font-medium mb-4">Typography</h4>

            <div className="mb-4">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select value={brandingOptions.fontFamily} onValueChange={handleFontChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter, sans-serif">Inter (Sans-serif)</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia (Serif)</SelectItem>
                  <SelectItem value="Courier New, monospace">Courier New (Monospace)</SelectItem>
                  <SelectItem value="Arial, sans-serif">Arial (Sans-serif)</SelectItem>
                  <SelectItem value="Times New Roman, serif">Times New Roman (Serif)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-medium text-gray-500">Font Sizes</h5>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="headerFontSize">Header Font Size</Label>
                  <span>{brandingOptions.headerFontSize}px</span>
                </div>
                <Slider
                  id="headerFontSize"
                  min={12}
                  max={24}
                  step={1}
                  value={[brandingOptions.headerFontSize]}
                  onValueChange={(value) =>
                    setBrandingOptions((prev) => ({
                      ...prev,
                      headerFontSize: value[0],
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="bodyFontSize">Body Font Size</Label>
                  <span>{brandingOptions.bodyFontSize}px</span>
                </div>
                <Slider
                  id="bodyFontSize"
                  min={10}
                  max={18}
                  step={1}
                  value={[brandingOptions.bodyFontSize]}
                  onValueChange={(value) =>
                    setBrandingOptions((prev) => ({
                      ...prev,
                      bodyFontSize: value[0],
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="itemFontSize">Item Text Font Size</Label>
                  <span>{brandingOptions.itemFontSize}px</span>
                </div>
                <Slider
                  id="itemFontSize"
                  min={10}
                  max={18}
                  step={1}
                  value={[brandingOptions.itemFontSize]}
                  onValueChange={(value) =>
                    setBrandingOptions((prev) => ({
                      ...prev,
                      itemFontSize: value[0],
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="footerFontSize">Footer Font Size</Label>
                  <span>{brandingOptions.footerFontSize}px</span>
                </div>
                <Slider
                  id="footerFontSize"
                  min={8}
                  max={16}
                  step={1}
                  value={[brandingOptions.footerFontSize]}
                  onValueChange={(value) =>
                    setBrandingOptions((prev) => ({
                      ...prev,
                      footerFontSize: value[0],
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

