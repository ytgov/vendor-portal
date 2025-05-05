import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { Documentation } from "@/models"
import BaseService from "@/services/base-service"

export type DocumentationCreationAttributes = Partial<CreationAttributes<Documentation>>

export class CreateService extends BaseService {
  constructor(private attributes: DocumentationCreationAttributes) {
    super()
  }

  async perform(): Promise<Documentation> {
    const { name, format, ...optionalAttributes } = this.attributes

    if (isNil(name) || isEmpty(name)) {
      throw new Error("name is required")
    }

    if (isNil(format) || isEmpty(format)) {
      throw new Error("format is required")
    }

    const documentation = await Documentation.create({
      ...optionalAttributes,
      name,
      format,
    })

    return documentation
  }
}

export default CreateService
