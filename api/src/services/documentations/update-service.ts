import { Attributes } from "@sequelize/core"

import { Documentation } from "@/models"
import BaseService from "@/services/base-service"

export type DocumentationAttributes = Partial<Attributes<Documentation>>

export class UpdateService extends BaseService {
  constructor(
    private documentation: Documentation,
    private attributes: DocumentationAttributes
  ) {
    super()
  }

  async perform() {
    const documentation = await this.documentation.update(this.attributes)
    return documentation
  }
}

export default UpdateService
