import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ProgramUser, User } from "@/models"
import { ALL_RECORDS_SCOPE, NO_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class ProgramUsersPolicy extends PolicyFactory(ProgramUser) {
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
    return ["roles"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["programId", "userId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<ProgramUser>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return NO_RECORDS_SCOPE
  }
}
