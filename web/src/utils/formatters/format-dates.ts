import { isEmpty, isNil } from "lodash"
import { DateTime, DateTimeFormatOptions, LocaleOptions } from "luxon"

export function formatDate(
  date: Date | string | null,
  formatOpts: DateTimeFormatOptions = DateTime.DATE_FULL,
  opts?: LocaleOptions
) {
  if (isNil(date)) return ""

  if (date instanceof Date) {
    return DateTime.fromJSDate(date).toLocaleString(formatOpts, opts)
  }

  return DateTime.fromISO(date).toLocaleString(formatOpts, opts)
}

export function formatDateRelative(input: Date | string | null | undefined): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") return DateTime.fromISO(input).toLocal().toRelative() ?? ""
  if (input) return DateTime.fromJSDate(input).toLocal().toRelative() ?? ""

  return ""
}

export default formatDate
