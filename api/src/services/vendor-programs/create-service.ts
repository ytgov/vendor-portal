import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { User, VendorProgram } from "@/models"
import BaseService from "@/services/base-service"

export type VendorProgramCreationAttributes = Partial<CreationAttributes<VendorProgram>>

export class CreateService extends BaseService {
  constructor(
    private attributes: VendorProgramCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<VendorProgram> {
    const { vendorId, programId, ...optionalAttributes } = this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(programId)) {
      throw new Error("programId is required")
    }

    const existingAcceptedVendorProgram = await VendorProgram.findOne({
      where: {
        vendorId,
        programId,
        status: VendorProgram.Statuses.ACCEPTED,
      },
    })

    if (existingAcceptedVendorProgram) {
      throw new Error("Vendor program already accepted")
    }

    const requestedByUserId = this.currentUser.id
    const requestedAt = new Date()

    const vendorProgram = await VendorProgram.create({
      ...optionalAttributes,
      vendorId,
      programId,
      requestedByUserId,
      requestedAt,
    })

    return vendorProgram
  }
}

export default CreateService
