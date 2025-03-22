import { Attributes } from "@sequelize/core"

import { ProgramDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramDocumentationAttributes = Partial<Attributes<ProgramDocumentation>>

export class UpdateService extends BaseService {
  constructor(
    private programDocumentation: ProgramDocumentation,
    private attributes: ProgramDocumentationAttributes
  ) {
    super()
  }

  async perform() {
    const programDocumentation = await this.programDocumentation.update(this.attributes)
    return programDocumentation
  }
}

export default UpdateService
