import { Attributes } from "@sequelize/core"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserAttributes = Partial<Attributes<User>>

export class UpdateService extends BaseService {
  constructor(
    private user: User,
    private attributes: UserAttributes
  ) {
    super()
  }

  async perform() {
    const user = await this.user.update(this.attributes)
    return user
  }
}

export default UpdateService
