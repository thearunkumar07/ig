"use client"

import { useRef } from "react"
import type { InvoiceData, BrandingOptions } from "@/types/invoice"
import { getCurrencySymbol } from "@/lib/defaults"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
  brandingOptions: BrandingOptions
}

export default function InvoicePreview({ invoiceData, brandingOptions }: InvoicePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const currencySymbol = getCurrencySymbol(invoiceData.currency)

  return (
    <div
      ref={previewRef}
      className="border rounded-md overflow-hidden bg-white"
      style={{
        fontFamily: brandingOptions.fontFamily,
        fontSize: `${brandingOptions.bodyFontSize}px`,
      }}
    >
      <div className="relative">
        {/* Watermark */}
        {invoiceData.watermark && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden"
            style={{ opacity: invoiceData.watermarkOpacity }}
          >
            <div
              className="text-8xl font-bold text-gray-300 transform rotate-45"
              style={{ color: brandingOptions.secondaryColor }}
            >
              {invoiceData.watermark}
            </div>
          </div>
        )}

        {/* Header */}
        {invoiceData.showHeader && invoiceData.headerText && (
          <div
            className="p-4 text-center border-b"
            style={{
              backgroundColor: `${brandingOptions.primaryColor}10`,
              fontSize: `${brandingOptions.headerFontSize - 2}px`,
            }}
          >
            {invoiceData.headerText}
          </div>
        )}

        {/* Invoice Content */}
        <div className="p-6 relative z-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {brandingOptions.logo ? (
                <img
                  src={brandingOptions.logo || "/placeholder.svg"}
                  alt="Company Logo"
                  style={{
                    maxWidth: `${brandingOptions.logoWidth}px`,
                    maxHeight: "100px",
                  }}
                  className="mb-4"
                />
              ) : null}
              <h1
                className="text-2xl font-bold"
                style={{
                  color: brandingOptions.primaryColor,
                  fontSize: `${brandingOptions.headerFontSize}px`,
                }}
              >
                {invoiceData.senderName}
              </h1>
              <div className="text-sm mt-1 whitespace-pre-line">{invoiceData.senderAddress}</div>
              {invoiceData.senderEmail && <div className="text-sm mt-1">Email: {invoiceData.senderEmail}</div>}
              {invoiceData.senderPhone && <div className="text-sm mt-1">Phone: {invoiceData.senderPhone}</div>}
              {invoiceData.senderGSTIN && <div className="text-sm mt-1">GSTIN/VAT: {invoiceData.senderGSTIN}</div>}
            </div>

            <div className="text-right">
              <h2
                className="text-xl font-bold uppercase"
                style={{
                  color: brandingOptions.primaryColor,
                  fontSize: `${brandingOptions.headerFontSize}px`,
                }}
              >
                Invoice
              </h2>
              <div className="text-sm mt-1">
                <span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}
              </div>
              <div className="text-sm mt-1">
                <span className="font-semibold">Date:</span> {new Date(invoiceData.date).toLocaleDateString()}
              </div>
              <div className="text-sm mt-1">
                <span className="font-semibold">Due Date:</span> {new Date(invoiceData.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="mb-8 p-4 rounded-md" style={{ backgroundColor: `${brandingOptions.primaryColor}10` }}>
            <h3
              className="text-md font-semibold mb-2"
              style={{
                color: brandingOptions.primaryColor,
                fontSize: `${brandingOptions.headerFontSize - 2}px`,
              }}
            >
              Bill To:
            </h3>
            {invoiceData.clientName ? (
              <>
                <div className="font-semibold">{invoiceData.clientName}</div>
                {invoiceData.clientAddress && (
                  <div className="text-sm mt-1 whitespace-pre-line">{invoiceData.clientAddress}</div>
                )}
                {invoiceData.clientEmail && <div className="text-sm mt-1">Email: {invoiceData.clientEmail}</div>}
                {invoiceData.clientPhone && <div className="text-sm mt-1">Phone: {invoiceData.clientPhone}</div>}
                {invoiceData.clientGSTIN && <div className="text-sm mt-1">GSTIN/VAT: {invoiceData.clientGSTIN}</div>}
              </>
            ) : (
              <div className="text-gray-500 italic">No client information</div>
            )}
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse" style={{ fontSize: `${brandingOptions.itemFontSize}px` }}>
              <thead>
                <tr style={{ backgroundColor: brandingOptions.primaryColor }} className="text-white">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-right">Qty</th>
                  <th className="py-2 px-4 text-right">Unit Price</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.description || "Item description"}</td>
                    <td className="py-2 px-4 text-right">{item.quantity}</td>
                    <td className="py-2 px-4 text-right">
                      {currencySymbol}
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {currencySymbol}
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>
                  {currencySymbol}
                  {invoiceData.subtotal.toFixed(2)}
                </span>
              </div>

              {invoiceData.discountValue > 0 && (
                <div className="flex justify-between py-2 text-red-600">
                  <span>
                    Discount
                    {invoiceData.discountType === "percentage" ? ` (${invoiceData.discountValue}%)` : ""}:
                  </span>
                  <span>
                    -{currencySymbol}
                    {invoiceData.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {invoiceData.taxRate > 0 && (
                <div className="flex justify-between py-2">
                  <span>Tax ({invoiceData.taxRate}%):</span>
                  <span>
                    {currencySymbol}
                    {invoiceData.taxAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {invoiceData.additionalCharges > 0 && (
                <div className="flex justify-between py-2">
                  <span>Additional Charges:</span>
                  <span>
                    {currencySymbol}
                    {invoiceData.additionalCharges.toFixed(2)}
                  </span>
                </div>
              )}

              <div
                className="flex justify-between py-2 font-bold text-lg mt-2"
                style={{ color: brandingOptions.primaryColor }}
              >
                <span>Total:</span>
                <span>
                  {currencySymbol}
                  {invoiceData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {invoiceData.bankDetails && (
            <div className="mb-8">
              <h3
                className="text-md font-semibold mb-2"
                style={{
                  color: brandingOptions.primaryColor,
                  fontSize: `${brandingOptions.headerFontSize - 2}px`,
                }}
              >
                Payment Details:
              </h3>
              <div className="text-sm whitespace-pre-line">{invoiceData.bankDetails}</div>
            </div>
          )}

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoiceData.notes && (
              <div>
                <h3
                  className="text-md font-semibold mb-2"
                  style={{
                    color: brandingOptions.primaryColor,
                    fontSize: `${brandingOptions.headerFontSize - 2}px`,
                  }}
                >
                  Notes:
                </h3>
                <div
                  className="text-sm whitespace-pre-line"
                  style={{ fontSize: `${brandingOptions.footerFontSize}px` }}
                >
                  {invoiceData.notes}
                </div>
              </div>
            )}

            {invoiceData.terms && (
              <div>
                <h3
                  className="text-md font-semibold mb-2"
                  style={{
                    color: brandingOptions.primaryColor,
                    fontSize: `${brandingOptions.headerFontSize - 2}px`,
                  }}
                >
                  Terms & Conditions:
                </h3>
                <div
                  className="text-sm whitespace-pre-line"
                  style={{ fontSize: `${brandingOptions.footerFontSize}px` }}
                >
                  {invoiceData.terms}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {invoiceData.showFooter && invoiceData.footerText && (
          <div
            className="p-4 text-center border-t"
            style={{
              backgroundColor: `${brandingOptions.primaryColor}10`,
              fontSize: `${brandingOptions.footerFontSize}px`,
            }}
          >
            {invoiceData.footerText}
          </div>
        )}
      </div>
    </div>
  )
}

