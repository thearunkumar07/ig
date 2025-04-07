import type { InvoiceData, BrandingOptions, Currency } from "@/types/invoice"
import { v4 as uuidv4 } from "uuid"

export const defaultInvoiceData: InvoiceData = {
  invoiceNumber: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "USD",

  // Header and Footer
  headerText: "",
  footerText: "Thank you for your business!",
  showHeader: false,
  showFooter: true,

  // Sender details
  senderName: "Your Company Name",
  senderAddress: "Your Address\nCity, State, ZIP\nCountry",
  senderEmail: "your.email@example.com",
  senderPhone: "+1 (123) 456-7890",
  senderGSTIN: "",

  // Client details
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  clientPhone: "",
  clientGSTIN: "",

  // Invoice items
  items: [
    {
      id: uuidv4(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ],

  // Additional fields
  notes: "",
  terms: "Payment due within 30 days",
  bankDetails: "",

  // Calculations
  subtotal: 0,
  discountType: "percentage",
  discountValue: 0,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  additionalCharges: 0,
  total: 0,

  // Watermark
  watermark: "",
  watermarkOpacity: 0.3,
}

export const defaultBrandingOptions: BrandingOptions = {
  logo: null,
  logoWidth: 150,
  primaryColor: "#4ade80",
  secondaryColor: "#16a34a",
  fontFamily: "Inter, sans-serif",
  headerFontSize: 16,
  bodyFontSize: 14,
  itemFontSize: 14,
  footerFontSize: 12,
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
]

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencies.find((c) => c.code === currencyCode)
  return currency ? currency.symbol : "$"
}

