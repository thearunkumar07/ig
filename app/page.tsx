"use client"

import { useState, useEffect } from "react"
import InvoiceForm from "@/components/invoice-form"
import InvoicePreview from "@/components/invoice-preview"
import BrandingSection from "@/components/branding-section"
import ExportOptions from "@/components/export-options"
import HeaderHero from "@/components/header-hero"
import FooterHero from "@/components/footer-hero"
import type { InvoiceData, BrandingOptions, Item } from "@/types/invoice"
import { defaultInvoiceData, defaultBrandingOptions } from "@/lib/defaults"

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultInvoiceData)
  const [brandingOptions, setBrandingOptions] = useState<BrandingOptions>(defaultBrandingOptions)
  const [savedClients, setSavedClients] = useState<string[]>([])
  const [savedItems, setSavedItems] = useState<Item[]>([])
  const [activeView, setActiveView] = useState<"form" | "preview">("form")
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedClients = localStorage.getItem("savedClients")
      const loadedItems = localStorage.getItem("savedItems")

      if (loadedClients) {
        setSavedClients(JSON.parse(loadedClients))
      }

      if (loadedItems) {
        setSavedItems(JSON.parse(loadedItems))
      }
    }
  }, [])

  // Save client to localStorage when a new one is added
  const saveClient = (clientName: string) => {
    if (clientName && !savedClients.includes(clientName)) {
      const updatedClients = [...savedClients, clientName]
      setSavedClients(updatedClients)
      if (typeof window !== "undefined") {
        localStorage.setItem("savedClients", JSON.stringify(updatedClients))
      }
    }
  }

  // Save item to localStorage when a new one is added
  const saveItem = (item: Item) => {
    if (item.description && !savedItems.some((i) => i.description === item.description)) {
      const updatedItems = [...savedItems, item]
      setSavedItems(updatedItems)
      if (typeof window !== "undefined") {
        localStorage.setItem("savedItems", JSON.stringify(updatedItems))
      }
    }
  }

  // If not yet on client side, render a simple loading state
  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invoice Generator</h1>
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Hero Section */}
      <HeaderHero />

      <div className="container mx-auto px-4 py-12" id="invoice-form-section">
        <h2 className="text-3xl font-bold text-center mb-8">Create Your Invoice</h2>

        {/* Mobile View Switcher */}
        <div className="lg:hidden flex mb-4 border rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 text-center ${activeView === "form" ? "bg-green-600 text-white" : "bg-white"}`}
            onClick={() => setActiveView("form")}
            type="button"
          >
            Edit Invoice
          </button>
          <button
            className={`flex-1 py-2 text-center ${activeView === "preview" ? "bg-green-600 text-white" : "bg-white"}`}
            onClick={() => setActiveView("preview")}
            type="button"
          >
            Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`space-y-8 ${activeView === "preview" ? "hidden lg:block" : ""}`}>
            <BrandingSection brandingOptions={brandingOptions} setBrandingOptions={setBrandingOptions} />

            <InvoiceForm
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              savedClients={savedClients}
              savedItems={savedItems}
              saveClient={saveClient}
              saveItem={saveItem}
            />
          </div>

          {/* Invoice Preview - Made Sticky */}
          <div className={`${activeView === "form" ? "hidden lg:block" : ""}`}>
            <div className="sticky top-20 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="max-h-[calc(100vh-150px)] overflow-auto">
                <InvoicePreview invoiceData={invoiceData} brandingOptions={brandingOptions} />
              </div>

              <div className="mt-6">
                <ExportOptions invoiceData={invoiceData} brandingOptions={brandingOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Hero Section */}
      <FooterHero />
    </main>
  )
}

