import { Attributes } from "@sequelize/core"

import { VendorDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type VendorDocumentationAttributes = Partial<Attributes<VendorDocumentation>>

export class UpdateService extends BaseService {
  constructor(
    private vendorDocumentation: VendorDocumentation,
    private attributes: VendorDocumentationAttributes
  ) {
    super()
  }

  async perform() {
    const vendorDocumentation = await this.vendorDocumentation.update(this.attributes)
    return vendorDocumentation
  }
}

export default UpdateService
