import { Attributes } from "@sequelize/core"

import { Program } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramAttributes = Partial<Attributes<Program>>

export class UpdateService extends BaseService {
  constructor(
    private program: Program,
    private attributes: ProgramAttributes
  ) {
    super()
  }

  async perform() {
    const program = await this.program.update(this.attributes)
    return program
  }
}

export default UpdateService
