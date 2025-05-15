import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { Documentation, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class DocumentationsPolicy extends PolicyFactory(Documentation) {
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
    return ["description"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["name", "format", "expires", ...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<Documentation>> {
    return ALL_RECORDS_SCOPE
  }
}
