import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { Program } from "@/models"
import BaseService from "@/services/base-service"

export type ProgramCreationAttributes = Partial<CreationAttributes<Program>>

export class CreateService extends BaseService {
  constructor(private attributes: ProgramCreationAttributes) {
    super()
  }

  async perform(): Promise<Program> {
    const { slug, department, offeredBy, isActive, name, ...optionalAttributes } = this.attributes

    if (isNil(slug) || isEmpty(slug)) {
      throw new Error("slug is required")
    }

    if (isNil(department) || isEmpty(department)) {
      throw new Error("department is required")
    }

    if (isNil(offeredBy) || isEmpty(offeredBy)) {
      throw new Error("offeredBy is required")
    }

    if (isNil(name) || isEmpty(name)) {
      throw new Error("name is required")
    }

    const program = await Program.create({
      ...optionalAttributes,
      slug,
      department,
      offeredBy,
      isActive: isActive ?? false,
      name,
    })

    return program
  }
}

export default CreateService
