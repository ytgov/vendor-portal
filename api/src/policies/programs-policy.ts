import { Attributes, FindOptions } from "@sequelize/core"
import sanitizeHtml from "sanitize-html"

import { Path } from "@/utils/deep-pick"
import { Program, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"
import { isNil } from "lodash"

export class ProgramsPolicy extends PolicyFactory(Program) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    return false
  }

  sanitizeRecord(record: Partial<Program>): Partial<Program> {
    if (!isNil(record.description)) {
      record.description = sanitizeHtml(record.description)
    }
    return record
  }

  permittedAttributes(): Path[] {
    return [
      "slug",
      "startDate",
      "endDate",
      "department",
      "offeredBy",
      "isActive",
      "name",
      "description",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Program>> {
    return ALL_RECORDS_SCOPE
  }
}
