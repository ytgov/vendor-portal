import { DateTime } from "luxon"

export function formatDate(date: Date | string): string {
  return DateTime.fromJSDate(new Date(date)).toFormat("yyyy-MM-dd")
}
