import { isNil } from "lodash"

export function formatCurrency(amount: number, decimals: number = 2): string {
  if (isNil(amount) || isNaN(amount)) return ""

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
  }).format(amount)
}
