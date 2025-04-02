import { Attributes } from "@sequelize/core"

import { VendorLinkRequest } from "@/models"
import BaseService from "@/services/base-service"

export type VendorLinkRequestAttributes = Partial<Attributes<VendorLinkRequest>>

export class UpdateService extends BaseService {
  constructor(
    private vendorLinkRequest: VendorLinkRequest,
    private attributes: VendorLinkRequestAttributes
  ) {
    super()
  }

  async perform() {
    const vendorLinkRequest = await this.vendorLinkRequest.update(this.attributes)
    return vendorLinkRequest
  }
}

export default UpdateService
