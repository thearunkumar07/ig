import { Github, Twitter, Mail, Heart, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FooterHero() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Invoice Generator</h2>
            <p className="text-gray-600 mb-4">
            Generate professional invoices instantly with FranchiseBhoomi's free invoice generator. Customize branding, add discounts, taxes, and download in PDF, PNG, or CSV.

            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="https://www.instagram.com/franchisebhoomi" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="https://www.youtube.com/@franchisebhoomi" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">Youtube</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="https://twitter.com/franchisebhoomi" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </div>
          </div>

          <div>
  <h3 className="font-semibold text-gray-900 mb-4">Franchise & Business Tools</h3>
  <ul className="space-y-3 text-gray-600">
    <li>
      <Link href="https://franchisebhoomi.com/calculator/royalty-calculator/" className="hover:text-blue-600 transition-colors">
      Franchise Royalty Calculator
      </Link>
    </li>
    <li>
      <Link href="https://franchisebhoomi.com/calculator/gst-calculator/" className="hover:text-blue-600 transition-colors">
        GST Calculator
      </Link>
    </li>
    <li>
      <Link href="https://franchisebhoomi.com/calculator/emi-calculator/t" className="hover:text-blue-600 transition-colors">
        EMI Calculator
      </Link>
    </li>
  </ul>
</div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <a href="https://franchisebhoomi.com/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://franchisebhoomi.com/privacy-policy/" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://franchisebhoomi.com/terms-and-conditions/" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="https://franchisebhoomi.com/contact-us/" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Free Invoice Generator. All rights reserved Franchisebhoomi. 
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              Made in Tamil Nadu with <Heart className="h-4 w-4 text-red-500 mx-1" /> for Franchises and small businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
