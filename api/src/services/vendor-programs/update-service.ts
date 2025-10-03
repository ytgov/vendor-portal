import { Attributes } from "@sequelize/core"

import { User, Vendor, VendorProgram } from "@/models"
import { VendorProgramStatuses } from "@/models/vendor-program"
import BaseService from "@/services/base-service"
import { VendorProgramAcceptedMailer } from "@/mailers"

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
    }

    if (this.attributes.status === VendorProgramStatuses.ACCEPTED) {
      const vendor = await Vendor.findByPk(this.vendorProgram.vendorId)
      const user = await User.findByPk(this.vendorProgram.requestedByUserId)

      if (!vendor) throw new Error("Vendor not found")
      if (!user) throw new Error("User not found")

      await VendorProgramAcceptedMailer.sendEmail(this.vendorProgram, vendor, user)
    }

    const vendorProgram = await this.vendorProgram.update(this.attributes)
    return vendorProgram
  }
}

export default UpdateService
