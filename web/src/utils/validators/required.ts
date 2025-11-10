import { isArray, isEmpty, isString, isNull, isObject, isUndefined, isDate } from "lodash"

export function required(v: unknown): boolean | string {
  if (isNull(v) || isUndefined(v)) {
    return "This field is required"
  }

  if (isDate(v)) return true

  if (isObject(v) && v instanceof File) return true

  if ((isArray(v) || isString(v) || isObject(v)) && isEmpty(v)) {
    return "This field is required"
  }

  return true
}

export default required
