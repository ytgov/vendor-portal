import { Attributes } from "@sequelize/core"

import { ProgramUser } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramUserAttributes = Partial<Attributes<ProgramUser>>

export class UpdateService extends BaseService {
  constructor(
    private programUser: ProgramUser,
    private attributes: ProgramUserAttributes
  ) {
    super()
  }

  async perform() {
    const programUser = await this.programUser.update(this.attributes)
    return programUser
  }
}

export default UpdateService
