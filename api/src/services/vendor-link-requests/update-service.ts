import { Attributes } from "@sequelize/core"
import { isNil, isUndefined } from "lodash"

import db, { VendorLinkRequest, VendorUser } from "@/models"
import { VendorLinkRequestStatuses } from "@/models/vendor-link-request"

import { VendorSearchService } from "@/services/vendors"
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
    if (
      this.vendorLinkRequest.status === VendorLinkRequestStatuses.PENDING &&
      this.attributes.status === VendorLinkRequestStatuses.ACCEPTED
    ) {
      if (isNil(this.attributes.matchedVendorId)) {
        throw new Error("Missing matchedVendorId")
      }

      const foundVendor = await VendorSearchService.perform(this.attributes.matchedVendorId)

      if (isUndefined(foundVendor)) {
        throw new Error("Failed to find vendor")
      }

      return db.transaction(async () => {
        await VendorUser.create({
          vendorId: foundVendor.id,
          userId: this.vendorLinkRequest.userId,
          isActive: true,
          isAdmin: false,
        })

        const vendorLinkRequest = await this.vendorLinkRequest.update(this.attributes)
        return vendorLinkRequest
      })
    }

    const vendorLinkRequest = await this.vendorLinkRequest.update(this.attributes)
    return vendorLinkRequest
  }
}

export default UpdateService
