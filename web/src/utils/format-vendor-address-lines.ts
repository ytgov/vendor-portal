import { Vendor } from "@/api/vendors-api"

export function formatVendorAddressLines(vendor: Vendor): string[] {
  const parts = []

  if (vendor.addressLine1) {
    parts.push(vendor.addressLine1)
  } else if (vendor.addressLine2) {
    parts.push(vendor.addressLine2)
  }

  parts.push(`${vendor.addressCity} ${vendor.addressProvince}, ${vendor.addressPostal}`)

  return parts.filter((part) => part.trim() !== "")
}
