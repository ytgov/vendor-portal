import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { VendorLinkRequest } from "@/models"
import BaseService from "@/services/base-service"

export type VendorLinkRequestCreationAttributes = Partial<CreationAttributes<VendorLinkRequest>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorLinkRequestCreationAttributes) {
    super()
  }

  async perform(): Promise<VendorLinkRequest> {
    const { userId, ...optionalAttributes } = this.attributes

    if (isNil(userId)) {
      throw new Error("userId is required")
    }

    const vendorLinkRequest = await VendorLinkRequest.create({
      ...optionalAttributes,
      userId,
    })

    return vendorLinkRequest
  }
}

export default CreateService
