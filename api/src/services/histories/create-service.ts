import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { History } from "@/models"
import BaseService from "@/services/base-service"

export type HistoryCreationAttributes = Partial<CreationAttributes<History>>

export class CreateService extends BaseService {
  constructor(private attributes: HistoryCreationAttributes) {
    super()
  }

  async perform(): Promise<History> {
    const { entityId, entityType, title, ...optionalAttributes } = this.attributes

    if (isNil(entityId)) {
      throw new Error("entityId is required")
    }

    if (isNil(entityType) || isEmpty(entityType)) {
      throw new Error("entityType is required")
    }

    if (isNil(title) || isEmpty(title)) {
      throw new Error("title is required")
    }

    const history = await History.create({
      ...optionalAttributes,
      entityId,
      entityType,
      title,
    })

    return history
  }
}

export default CreateService
