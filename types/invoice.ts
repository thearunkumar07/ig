export interface Item {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  currency: string

  // Header and Footer
  headerText: string
  footerText: string
  showHeader: boolean
  showFooter: boolean

  // Sender details
  senderName: string
  senderAddress: string
  senderEmail: string
  senderPhone: string
  senderGSTIN: string

  // Client details
  clientName: string
  clientAddress: string
  clientEmail: string
  clientPhone: string
  clientGSTIN: string

  // Invoice items
  items: Item[]

  // Additional fields
  notes: string
  terms: string
  bankDetails: string

  // Calculations
  subtotal: number
  discountType: "percentage" | "flat"
  discountValue: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  additionalCharges: number
  total: number

  // Watermark
  watermark: string
  watermarkOpacity: number
}

export interface BrandingOptions {
  logo: string | null
  logoWidth: number
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  headerFontSize: number
  bodyFontSize: number
  itemFontSize: number
  footerFontSize: number
}

export type Currency = {
  code: string
  symbol: string
  name: string
}

