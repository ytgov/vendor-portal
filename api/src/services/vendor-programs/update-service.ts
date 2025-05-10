import { Attributes } from "@sequelize/core"

import { User, VendorProgram } from "@/models"
import { VendorProgramStatuses } from "@/models/vendor-program"
import BaseService from "@/services/base-service"

export type VendorProgramAttributes = Partial<Attributes<VendorProgram>>

export class UpdateService extends BaseService {
  constructor(
    private vendorProgram: VendorProgram,
    private attributes: VendorProgramAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    if (
      (this.vendorProgram.status === VendorProgramStatuses.PENDING &&
        this.attributes.status === VendorProgramStatuses.ACCEPTED) ||
      this.attributes.status === VendorProgramStatuses.REJECTED
    ) {
      this.attributes.reviewByUserId = this.currentUser.id
      this.attributes.reviewAt = new Date()

      const vendorProgram = await this.vendorProgram.update(this.attributes)
      return vendorProgram
    }

    const vendorProgram = await this.vendorProgram.update(this.attributes)
    return vendorProgram
  }
}

export default UpdateService
