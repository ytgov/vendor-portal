import { isEmpty, isString } from "lodash"
import { DateTime } from "luxon"

// ISO 8601 to YYY-MM-DD
export function formatDate(input: string | Date | undefined): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toFormat("yyyy-MM-dd")
  if (input) return DateTime.fromJSDate(input).toLocal().toFormat("yyyy-MM-dd")

  return ""
}

// ISO 8601 to November 2, 2023
export function formatDateHumanReadable(input: string | Date | undefined): string {
  if (isEmpty(input)) return ""

  if (isString(input)) {
    const date = new Date(input)
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  } else if (input) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return input.toLocaleDateString("en-US", options)
  }

  return ""
}

export function formatRelative(input: string | Date | undefined): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toRelative() ?? ""
  if (input) return DateTime.fromJSDate(input).toLocal().toRelative() ?? ""

  return ""
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
