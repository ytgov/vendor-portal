import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { VendorDocumentation, User } from "@/models"
import { ALL_RECORDS_SCOPE, NO_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class VendorDocumentationsPolicy extends PolicyFactory(VendorDocumentation) {
  show(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    return false
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

  permittedAttributes(): Path[] {
    return [
      "status",
      "expiresAt",
      "reviewByUserId",
      "reviewAt",
      "reviewNotes",
      "textValue",
      "fileName",
      "mimeType",
      "size",
      "content",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return ["vendorId", "documentationId", "createdByUserId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<VendorDocumentation>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return NO_RECORDS_SCOPE
  }
}
