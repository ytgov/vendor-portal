import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Vendor, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"
import { isNil } from "lodash"

export class VendorsActionsPolicy extends PolicyFactory(Vendor) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    const vendorUser = this.user.vendors?.find((v) => v.vendorId === this.record.vendorId)

    return !isNil(vendorUser) && vendorUser?.isActive
  }

  update(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    const vendorUser = this.user.vendors?.find((v) => v.vendorId === this.record.vendorId)

    return !isNil(vendorUser) && vendorUser?.isActive
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) {
      return true
    }

    return false
  }

  permittedAttributes(): Path[] {
    return []
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<Vendor>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return {
      include: [
        {
          association: "vendorUsers",
          where: {
            isActive: true,
            userId: user.id,
          },
        },
      ],
    }
  }
}
