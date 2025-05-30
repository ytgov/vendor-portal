import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { History, User } from "@/models"
import { ALL_RECORDS_SCOPE, NO_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class HistoriesPolicy extends PolicyFactory(History) {
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
    return ["entityId", "entityType", "title", "subtitle", "details"]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<History>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return NO_RECORDS_SCOPE
  }
}
