import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { VendorProgram } from "@/models"
import BaseService from "@/services/base-service"

export type VendorProgramCreationAttributes = Partial<CreationAttributes<VendorProgram>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorProgramCreationAttributes) {
    super()
  }

  async perform(): Promise<VendorProgram> {
    const { vendorId, programId, requestedByUserId, status, ...optionalAttributes } =
      this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(programId)) {
      throw new Error("programId is required")
    }

    if (isNil(requestedByUserId)) {
      throw new Error("requestedByUserId is required")
    }

    if (isNil(status) || isEmpty(status)) {
      throw new Error("status is required")
    }

    const vendorProgram = await VendorProgram.create({
      ...optionalAttributes,
      vendorId,
      programId,
      requestedByUserId,
      status,
    })

    return vendorProgram
  }
}

export default CreateService
