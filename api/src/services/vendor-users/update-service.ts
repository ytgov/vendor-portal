import { Attributes } from "@sequelize/core"

import { VendorUser } from "@/models"
import BaseService from "@/services/base-service"

export type VendorUserAttributes = Partial<Attributes<VendorUser>>

export class UpdateService extends BaseService {
  constructor(
    private vendorUser: VendorUser,
    private attributes: VendorUserAttributes
  ) {
    super()
  }

  async perform() {
    const vendorUser = await this.vendorUser.update(this.attributes)
    return vendorUser
  }
}

export default UpdateService
