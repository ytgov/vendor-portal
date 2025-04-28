import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { Vendor } from "@/models"
import BaseService from "@/services/base-service"

export type VendorCreationAttributes = Partial<CreationAttributes<Vendor>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorCreationAttributes) {
    super()
  }

  async perform(): Promise<Vendor> {
    const {
      slug,
      status,
      org,
      vendorId,
      name,
      shortName,
      isActive,
      isPerson,
      isPayable,
      isElectronicPay,

      ...optionalAttributes
    } = this.attributes

    if (isNil(slug) || isEmpty(slug)) {
      throw new Error("slug is required")
    }

    if (isNil(status) || isEmpty(status)) {
      throw new Error("status is required")
    }

    if (isNil(org) || isEmpty(org)) {
      throw new Error("org is required")
    }

    if (isNil(vendorId) || isEmpty(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(name) || isEmpty(name)) {
      throw new Error("name is required")
    }

    if (isNil(shortName) || isEmpty(shortName)) {
      throw new Error("shortName is required")
    }

    const vendor = await Vendor.create({
      ...optionalAttributes,
      slug,
      status,
      org,
      vendorId,
      name,
      shortName,
      isActive: isActive ?? true,
      isPerson: isPerson ?? false,
      isPayable: isPayable ?? true,
      isElectronicPay: isElectronicPay ?? true,
    })

    return vendor
  }
}

export default CreateService
