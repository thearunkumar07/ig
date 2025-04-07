"use client"

import type React from "react"
import { v4 as uuidv4 } from "uuid"
import type { InvoiceData, Item } from "@/types/invoice"
import { currencies } from "@/lib/defaults"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus } from "lucide-react"

interface InvoiceFormProps {
  invoiceData: InvoiceData
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>
  savedClients: string[]
  savedItems: Item[]
  saveClient: (clientName: string) => void
  saveItem: (item: Item) => void
}

export default function InvoiceForm({
  invoiceData,
  setInvoiceData,
  savedClients,
  savedItems,
  saveClient,
  saveItem,
}: InvoiceFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setInvoiceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setInvoiceData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleClientSelect = (clientName: string) => {
    const client = savedClients.find((c) => c === clientName)
    if (client) {
      setInvoiceData((prev) => ({ ...prev, clientName }))
    }
  }

  const handleItemChange = (id: string, field: keyof Item, value: string | number) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate amount if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            const quantity = field === "quantity" ? Number(value) : item.quantity
            const unitPrice = field === "unitPrice" ? Number(value) : item.unitPrice
            updatedItem.amount = quantity * unitPrice
          }

          return updatedItem
        }
        return item
      })

      // Calculate subtotal, tax, and total
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const discountAmount =
        prev.discountType === "percentage" ? subtotal * (prev.discountValue / 100) : prev.discountValue
      const taxAmount = (subtotal - discountAmount) * (prev.taxRate / 100)
      const total = subtotal - discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        discountAmount,
        taxAmount,
        total,
      }
    })
  }

  const handleItemSelect = (itemDescription: string) => {
    const item = savedItems.find((i) => i.description === itemDescription)
    if (item) {
      addItem(item)
    }
  }

  const addItem = (itemTemplate?: Item) => {
    const newItem: Item = itemTemplate
      ? { ...itemTemplate, id: uuidv4() }
      : { id: uuidv4(), description: "", quantity: 1, unitPrice: 0, amount: 0 }

    setInvoiceData((prev) => {
      const updatedItems = [...prev.items, newItem]

      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const discountAmount =
        prev.discountType === "percentage" ? subtotal * (prev.discountValue / 100) : prev.discountValue
      const taxAmount = (subtotal - discountAmount) * (prev.taxRate / 100)
      const total = subtotal - discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        discountAmount,
        taxAmount,
        total,
      }
    })
  }

  const removeItem = (id: string) => {
    setInvoiceData((prev) => {
      if (prev.items.length <= 1) {
        return prev // Keep at least one item
      }

      const updatedItems = prev.items.filter((item) => item.id !== id)

      // Recalculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const discountAmount =
        prev.discountType === "percentage" ? subtotal * (prev.discountValue / 100) : prev.discountValue
      const taxAmount = (subtotal - discountAmount) * (prev.taxRate / 100)
      const total = subtotal - discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        discountAmount,
        taxAmount,
        total,
      }
    })
  }

  const handleDiscountTypeChange = (value: "percentage" | "flat") => {
    setInvoiceData((prev) => {
      const discountAmount = value === "percentage" ? prev.subtotal * (prev.discountValue / 100) : prev.discountValue
      const taxAmount = (prev.subtotal - discountAmount) * (prev.taxRate / 100)
      const total = prev.subtotal - discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        discountType: value,
        discountAmount,
        taxAmount,
        total,
      }
    })
  }

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discountValue = Number(e.target.value)

    setInvoiceData((prev) => {
      const discountAmount = prev.discountType === "percentage" ? prev.subtotal * (discountValue / 100) : discountValue
      const taxAmount = (prev.subtotal - discountAmount) * (prev.taxRate / 100)
      const total = prev.subtotal - discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        discountValue,
        discountAmount,
        taxAmount,
        total,
      }
    })
  }

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const taxRate = Number(e.target.value)

    setInvoiceData((prev) => {
      const taxAmount = (prev.subtotal - prev.discountAmount) * (taxRate / 100)
      const total = prev.subtotal - prev.discountAmount + taxAmount + prev.additionalCharges

      return {
        ...prev,
        taxRate,
        taxAmount,
        total,
      }
    })
  }

  const handleAdditionalChargesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const additionalCharges = Number(e.target.value)

    setInvoiceData((prev) => {
      const total = prev.subtotal - prev.discountAmount + prev.taxAmount + additionalCharges

      return {
        ...prev,
        additionalCharges,
        total,
      }
    })
  }

  const handleWatermarkOpacityChange = (value: number[]) => {
    setInvoiceData((prev) => ({
      ...prev,
      watermarkOpacity: value[0],
    }))
  }

  const handleSaveClient = () => {
    if (invoiceData.clientName) {
      saveClient(invoiceData.clientName)
    }
  }

  const handleSaveItem = (item: Item) => {
    if (item.description) {
      saveItem(item)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
      <h2 className="text-xl font-semibold mb-6">Invoice Details</h2>

      {/* Header & Footer */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Header & Footer</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showHeader" className="cursor-pointer">
                Show Header
              </Label>
              <Switch
                id="showHeader"
                checked={invoiceData.showHeader}
                onCheckedChange={(checked) => handleSwitchChange("showHeader", checked)}
              />
            </div>

            {invoiceData.showHeader && (
              <div>
                <Label htmlFor="headerText">Header Text</Label>
                <Textarea
                  id="headerText"
                  name="headerText"
                  value={invoiceData.headerText}
                  onChange={handleInputChange}
                  placeholder="Enter header text (e.g., company slogan, website)"
                  rows={2}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <Label htmlFor="showFooter" className="cursor-pointer">
                Show Footer
              </Label>
              <Switch
                id="showFooter"
                checked={invoiceData.showFooter}
                onCheckedChange={(checked) => handleSwitchChange("showFooter", checked)}
              />
            </div>

            {invoiceData.showFooter && (
              <div>
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  name="footerText"
                  value={invoiceData.footerText}
                  onChange={handleInputChange}
                  placeholder="Enter footer text (e.g., thank you message, contact info)"
                  rows={2}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={invoiceData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Invoice Date</Label>
          <Input id="date" name="date" type="date" value={invoiceData.date} onChange={handleInputChange} />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" name="dueDate" type="date" value={invoiceData.dueDate} onChange={handleInputChange} />
        </div>
      </div>

      {/* Your Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Your Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="senderName">Name/Company</Label>
              <Input id="senderName" name="senderName" value={invoiceData.senderName} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="senderAddress">Address</Label>
              <Textarea
                id="senderAddress"
                name="senderAddress"
                value={invoiceData.senderAddress}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderEmail">Email</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  value={invoiceData.senderEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="senderPhone">Phone</Label>
                <Input
                  id="senderPhone"
                  name="senderPhone"
                  value={invoiceData.senderPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="senderGSTIN">GSTIN/VAT Number</Label>
              <Input id="senderGSTIN" name="senderGSTIN" value={invoiceData.senderGSTIN} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            {savedClients.length > 0 && (
              <div className="flex items-center">
                <Label htmlFor="savedClientSelect" className="mr-2">
                  Saved Clients:
                </Label>
                <Select onValueChange={handleClientSelect}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedClients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="clientName">Name/Company</Label>
                <Input id="clientName" name="clientName" value={invoiceData.clientName} onChange={handleInputChange} />
              </div>
              <Button type="button" variant="outline" onClick={handleSaveClient} disabled={!invoiceData.clientName}>
                Save Client
              </Button>
            </div>

            <div>
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                name="clientAddress"
                value={invoiceData.clientAddress}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="clientPhone">Phone</Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  value={invoiceData.clientPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="clientGSTIN">GSTIN/VAT Number</Label>
              <Input id="clientGSTIN" name="clientGSTIN" value={invoiceData.clientGSTIN} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <div>
        <h3 className="text-lg font-medium mb-4">Invoice Items</h3>

        {savedItems.length > 0 && (
          <div className="flex items-center mb-4">
            <Label htmlFor="savedItemSelect" className="mr-2">
              Add Saved Item:
            </Label>
            <Select onValueChange={handleItemSelect} className="flex-1 mr-2">
              <SelectTrigger>
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {savedItems.map((item) => (
                  <SelectItem key={item.id} value={item.description}>
                    {item.description} (${item.unitPrice.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          {invoiceData.items.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Item #{index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveItem(item)}
                    disabled={!item.description}
                  >
                    Save Item
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={invoiceData.items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                  <Input
                    id={`item-${item.id}-description`}
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`item-${item.id}-quantity`}>Quantity</Label>
                    <Input
                      id={`item-${item.id}-quantity`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${item.id}-unitPrice`}>Unit Price</Label>
                    <Input
                      id={`item-${item.id}-unitPrice`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${item.id}-amount`}>Amount</Label>
                    <Input
                      id={`item-${item.id}-amount`}
                      type="number"
                      value={item.amount}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" className="w-full" onClick={() => addItem()}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div>
        <h3 className="text-lg font-medium mb-4">Totals</h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Subtotal</Label>
              <Input type="number" value={invoiceData.subtotal} readOnly className="bg-gray-50" />
            </div>

            <div className="col-span-2">
              <Label>Discount</Label>
              <div className="flex items-center gap-4 mt-2">
                <RadioGroup
                  value={invoiceData.discountType}
                  onValueChange={(value: "percentage" | "flat") => handleDiscountTypeChange(value)}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="discount-percentage" />
                    <Label htmlFor="discount-percentage">Percentage (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flat" id="discount-flat" />
                    <Label htmlFor="discount-flat">Flat Amount</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  step={invoiceData.discountType === "percentage" ? "1" : "0.01"}
                  value={invoiceData.discountValue}
                  onChange={handleDiscountValueChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={handleTaxRateChange}
              />
            </div>

            <div>
              <Label>Tax Amount</Label>
              <Input type="number" value={invoiceData.taxAmount} readOnly className="bg-gray-50" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="additionalCharges">Additional Charges</Label>
              <Input
                id="additionalCharges"
                type="number"
                min="0"
                step="0.01"
                value={invoiceData.additionalCharges}
                onChange={handleAdditionalChargesChange}
              />
            </div>

            <div className="col-span-2">
              <Label>Total</Label>
              <Input type="number" value={invoiceData.total} readOnly className="bg-gray-50 font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Other Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="bankDetails">Bank Account Details</Label>
            <Textarea
              id="bankDetails"
              name="bankDetails"
              value={invoiceData.bankDetails}
              onChange={handleInputChange}
              rows={3}
              placeholder="Account Name, Account Number, Bank Name, IFSC/SWIFT Code, etc."
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={invoiceData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any additional notes for the client..."
            />
          </div>

          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              name="terms"
              value={invoiceData.terms}
              onChange={handleInputChange}
              rows={3}
              placeholder="Payment terms, return policy, etc."
            />
          </div>

          <div>
            <Label htmlFor="watermark">Watermark (e.g., PAID, DRAFT, OVERDUE)</Label>
            <Input
              id="watermark"
              name="watermark"
              value={invoiceData.watermark}
              onChange={handleInputChange}
              placeholder="Leave empty for no watermark"
            />
          </div>

          {invoiceData.watermark && (
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="watermarkOpacity">Watermark Opacity</Label>
                <span>{Math.round(invoiceData.watermarkOpacity * 100)}%</span>
              </div>
              <Slider
                id="watermarkOpacity"
                min={0.1}
                max={0.5}
                step={0.01}
                value={[invoiceData.watermarkOpacity]}
                onValueChange={handleWatermarkOpacityChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

