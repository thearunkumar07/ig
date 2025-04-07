"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import MobileMenu from "./mobile-menu"

export default function HeaderHero() {
  return (
    <div className="bg-white">
      {/* Navigation Bar - Made Sticky - Desktop & Tablet Only */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left side - Title and subtitle */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Free Invoice Generator</h1>
            <p className="text-sm text-gray-600">By Franchisebhoomi</p>
          </div>

          {/* Right side - CTA links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://franchisebhoomi.com/calculator" className="text-blue-600 hover:text-blue-800 font-medium">
              Check out our Business tools
            </Link>
            <Link
              href="https://franchisebhoomi.com/franchises/"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded uppercase font-bold text-sm"
            >
              Franchise Opportunities
            </Link>
          </div>

          {/* Mobile Menu (visible only on mobile) */}
          <MobileMenu />
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">Create Professional Invoices in Minutes</h1>

            <p className="text-gray-600 text-xl">
              Free, simple, and powerful invoice generator. No login required.
              <br />
              Download in multiple formats.
            </p>

            <button
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center"
              onClick={() => document.getElementById("invoice-form-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center">
                <span className="font-medium">100% Free</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">No Login Required</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Multiple Formats</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-md">
                <div className="bg-green-100 h-8 w-1/3 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="bg-gray-100 h-12 w-full rounded"></div>
                  <div className="bg-gray-100 h-24 w-full rounded"></div>
                  <div className="bg-gray-100 h-12 w-full rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

