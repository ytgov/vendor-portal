import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { ProgramDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramDocumentationCreationAttributes = Partial<
  CreationAttributes<ProgramDocumentation>
>

export class CreateService extends BaseService {
  constructor(private attributes: ProgramDocumentationCreationAttributes) {
    super()
  }

  async perform(): Promise<ProgramDocumentation> {
    const { programId, documentationId, ...optionalAttributes } = this.attributes

    if (isNil(programId)) {
      throw new Error("programId is required")
    }

    if (isNil(documentationId)) {
      throw new Error("documentationId is required")
    }

    const programDocumentation = await ProgramDocumentation.create({
      ...optionalAttributes,
      programId,
      documentationId,
    })

    return programDocumentation
  }
}

export default CreateService
