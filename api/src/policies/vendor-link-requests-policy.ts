import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { VendorLinkRequest, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class VendorLinkRequestsPolicy extends PolicyFactory(VendorLinkRequest) {
  show(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    if (this.user.id == this.record.userId) {
      return true
    }

    return false
  }

  create(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    if (this.record.status === VendorLinkRequest.Statuses.PENDING) {
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
      "matchedVendorId",
      "businessName",
      "operatingName",
      "ycorNumber",
      "address",
      "vendorId",
      "status",
      "reviewNotes",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return ["userId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<VendorLinkRequest>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return {
      where: {
        userId: user.id,
      },
    }
  }
}
