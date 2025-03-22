import { Attributes } from "@sequelize/core"

import { VendorProgram } from "@/models"
import BaseService from "@/services/base-service"

export type VendorProgramAttributes = Partial<Attributes<VendorProgram>>

export class UpdateService extends BaseService {
  constructor(
    private vendorProgram: VendorProgram,
    private attributes: VendorProgramAttributes
  ) {
    super()
  }

  async perform() {
    const vendorProgram = await this.vendorProgram.update(this.attributes)
    return vendorProgram
  }
}

export default UpdateService
