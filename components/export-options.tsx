"use client"

import { useState } from "react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import type { InvoiceData, BrandingOptions } from "@/types/invoice"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Download,
  FileImage,
  FileSpreadsheet,
  FileJson,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  ChevronDown,
  Loader2,
} from "lucide-react"

interface ExportOptionsProps {
  invoiceData: InvoiceData
  brandingOptions: BrandingOptions
}

export default function ExportOptions({ invoiceData, brandingOptions }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const generatePDF = async () => {
    setIsExporting(true)
    try {
      // Get the invoice element
      const invoiceElement = document.querySelector(".border.rounded-md.overflow-hidden.bg-white")

      if (!invoiceElement) {
        console.error("Invoice element not found")
        return
      }

      // Create a canvas from the invoice element
      const canvas = await html2canvas(invoiceElement as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // To handle images from different origins
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")

      // Split into pages if needed
      let heightLeft = imgHeight
      let position = 0
      let pageNumber = 1

      // Add first page
      pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        pageNumber++
      }

      // Save the PDF
      pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsImage = async () => {
    setIsExporting(true)
    try {
      // Get the invoice element
      const invoiceElement = document.querySelector(".border.rounded-md.overflow-hidden.bg-white")

      if (!invoiceElement) {
        console.error("Invoice element not found")
        return
      }

      // Create a canvas from the invoice element
      const canvas = await html2canvas(invoiceElement as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // To handle images from different origins
        logging: false,
        backgroundColor: "#ffffff",
      })

      // Convert canvas to image and download
      const imageUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `Invoice-${invoiceData.invoiceNumber}.png`
      link.click()
    } catch (error) {
      console.error("Error exporting as image:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsCSV = () => {
    setIsExporting(true)
    try {
      // Create CSV header
      let csvContent = "Description,Quantity,Unit Price,Amount\n"

      // Add items
      invoiceData.items.forEach((item) => {
        csvContent += `"${item.description}",${item.quantity},${item.unitPrice},${item.amount}\n`
      })

      // Add totals
      csvContent += `\nSubtotal,,,"${invoiceData.subtotal}"\n`
      if (invoiceData.discountValue > 0) {
        csvContent += `Discount ${invoiceData.discountType === "percentage" ? `(${invoiceData.discountValue}%)` : ""},,,"${invoiceData.discountAmount}"\n`
      }
      if (invoiceData.taxRate > 0) {
        csvContent += `Tax (${invoiceData.taxRate}%),,,"${invoiceData.taxAmount}"\n`
      }
      if (invoiceData.additionalCharges > 0) {
        csvContent += `Additional Charges,,,"${invoiceData.additionalCharges}"\n`
      }
      csvContent += `Total,,,"${invoiceData.total}"\n`

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${invoiceData.invoiceNumber}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting as CSV:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJSON = () => {
    setIsExporting(true)
    try {
      // Create JSON data
      const jsonData = {
        invoiceData,
        brandingOptions,
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Invoice-${invoiceData.invoiceNumber}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting as JSON:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const shareOnSocialMedia = (platform: "twitter" | "linkedin" | "facebook") => {
    const text = `Check out this invoice generator tool!`
    const url = window.location.href

    let shareUrl = ""

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={generatePDF} disabled={isExporting} className="flex-1 bg-green-600 hover:bg-green-700">
        {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
        Download PDF
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportAsImage}>
            <FileImage className="h-4 w-4 mr-2" />
            Export as Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => shareOnSocialMedia("twitter")}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareOnSocialMedia("linkedin")}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareOnSocialMedia("facebook")}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

