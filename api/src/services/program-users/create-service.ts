import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { ProgramUser } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramUserCreationAttributes = Partial<CreationAttributes<ProgramUser>>

export class CreateService extends BaseService {
  constructor(private attributes: ProgramUserCreationAttributes) {
    super()
  }

  async perform(): Promise<ProgramUser> {
    const { programId, userId, ...optionalAttributes } = this.attributes

    if (isNil(programId)) {
      throw new Error("programId is required")
    }
    if (isNil(userId)) {
      throw new Error("userId is required")
    }

    const programUser = await ProgramUser.create({
      ...optionalAttributes,
      programId,
      userId,
    })

    return programUser
  }
}

export default CreateService
