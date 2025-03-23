import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { VendorUser } from "@/models"
import BaseService from "@/services/base-service"

export type VendorUserCreationAttributes = Partial<CreationAttributes<VendorUser>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorUserCreationAttributes) {
    super()
  }

  async perform(): Promise<VendorUser> {
    const { vendorId, userId, isActive, isAdmin, ...optionalAttributes } = this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(userId)) {
      throw new Error("userId is required")
    }

    const vendorUser = await VendorUser.create({
      ...optionalAttributes,
      vendorId,
      userId,
      isActive: isActive ?? false,
      isAdmin: isAdmin ?? false,
    })

    return vendorUser
  }
}

export default CreateService
