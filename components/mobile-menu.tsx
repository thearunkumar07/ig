"use client"

import { useState } from "react";
import { X, FileText, Calculator, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (typeof window !== "undefined") {
      document.body.style.overflow = isOpen ? "auto" : "hidden";
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700 p-2 flex items-center justify-center"
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isOpen}
        type="button"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[black] text-white shadow-lg">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
                aria-label="Close menu"
                type="button"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Logo section */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                <div className="h-16 w-48 flex items-center justify-center rounded mb-3 overflow-hidden bg-black">
                    <Image
                      src="/bhoomi-logo.png"
                      alt="Franchise Bhoomi Logo"
                      width={192}
                      height={64}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu links */}
            <div className="px-6 pb-8 space-y-8">
              {/* Business Calculators Section */}
              <div>
                <div className="flex items-center mb-4">
                  <Calculator className="h-5 w-5 mr-2" />
                  <h3 className="text-xl font-semibold">Business Calculators</h3>
                </div>
                <ul className="space-y-4 pl-7">
                  <li>
                    <Link
                      href="https://franchisebhoomi.com/calculator/royalty-calculator/"
                      className="block py-2 hover:bg-gray-700 hover:pl-2 transition-all rounded"
                      onClick={handleClose}
                    >
                      Franchise Royalty Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://franchisebhoomi.com/calculator/gst-calculator/"
                      className="block py-2 hover:bg-gray-700 hover:pl-2 transition-all rounded"
                      onClick={handleClose}
                    >
                      GST Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://franchisebhoomi.com/calculator/emi-calculator/"
                      className="block py-2 hover:bg-gray-700 hover:pl-2 transition-all rounded"
                      onClick={handleClose}
                    >
                      EMI Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Useful Links Section */}
              <div>
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 mr-2" />
                  <h3 className="text-xl font-semibold">Useful Links</h3>
                </div>
                <ul className="space-y-4 pl-7">
                  <li>
                    <Link
                      href="https://franchisebhoomi.com/franchise-business-loan/"
                      className="block py-2 hover:bg-gray-700 hover:pl-2 transition-all rounded"
                      onClick={handleClose}
                    >
                      Franchise & Business Loan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://franchisebhoomi.com/franchises/"
                      className="block py-2 hover:bg-gray-700 hover:pl-2 transition-all rounded"
                      onClick={handleClose}
                    >
                      Franchise Opportunities
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}