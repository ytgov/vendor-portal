import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { VendorUser, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class VendorUsersPolicy extends PolicyFactory(VendorUser) {
  show(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    if (this.record.userId == this.user.id) {
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
    return ["isActive", "isAdmin", "decisionByUserId", "decisionAt"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["vendorId", "userId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<VendorUser>> {
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
