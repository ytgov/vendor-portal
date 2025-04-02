import { Attributes } from "@sequelize/core"

import { Vendor } from "@/models"
import BaseService from "@/services/base-service"

export type VendorAttributes = Partial<Attributes<Vendor>>

export class UpdateService extends BaseService {
  constructor(
    private vendor: Vendor,
    private attributes: VendorAttributes
  ) {
    super()
  }

  async perform() {
    const vendor = await this.vendor.update(this.attributes)
    return vendor
  }
}

export default UpdateService
