import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Vendor, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class VendorsPolicy extends PolicyFactory(Vendor) {
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
      "slug",
      "status",
      "org",
      "vendorId",
      "name",
      "shortName",
      "isActive",
      "isPerson",
      "isPayable",
      "isElectronicPay",
      "addressLine1",
      "addressLine2",
      "addressProvince",
      "addressPostal",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Vendor>> {
    return ALL_RECORDS_SCOPE
  }
}
