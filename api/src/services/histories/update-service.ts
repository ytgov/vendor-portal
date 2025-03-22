import { Attributes } from "@sequelize/core"

import { History } from "@/models"
import BaseService from "@/services/base-service"

export type HistoryAttributes = Partial<Attributes<History>>

export class UpdateService extends BaseService {
  constructor(
    private history: History,
    private attributes: HistoryAttributes
  ) {
    super()
  }

  async perform() {
    const history = await this.history.update(this.attributes)
    return history
  }
}

export default UpdateService
