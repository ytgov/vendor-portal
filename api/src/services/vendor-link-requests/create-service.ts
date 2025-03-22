import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { VendorLinkRequest } from "@/models"
import BaseService from "@/services/base-service"

export type VendorLinkRequestCreationAttributes = Partial<CreationAttributes<VendorLinkRequest>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorLinkRequestCreationAttributes) {
    super()
  }

  async perform(): Promise<VendorLinkRequest> {
    const { userId, status, ...optionalAttributes } = this.attributes

    if (isNil(userId)) {
      throw new Error("userId is required")
    }

    if (isNil(status) || isEmpty(status)) {
      throw new Error("status is required")
    }

    const vendorLinkRequest = await VendorLinkRequest.create({
      ...optionalAttributes,
      userId,
      status,
    })

    return vendorLinkRequest
  }
}

export default CreateService
