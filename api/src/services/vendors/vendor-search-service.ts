import axios from "axios"
import { isEmpty, isNil } from "lodash"
import { CreationAttributes } from "@sequelize/core"

import { VENDOR_AUTH_HEADER, VENDOR_API_URL } from "@/config"
import { Vendor } from "@/models/vendor"

import BaseService from "@/services/base-service"
import { UpdateService, CreateService } from "@/services/vendors"

export type VendorCreationAttributes = Partial<CreationAttributes<Vendor>>

/**
 * _TODO_ this class really needs a refactor
 */
export class VendorSearchService extends BaseService {
  constructor(private vendorId: string) {
    super()
  }

  async perform() {
    if (typeof this.vendorId === "number" || !isNaN(Number(this.vendorId))) {
      return await Vendor.findByPk(this.vendorId)
    }

    const localVendor = await Vendor.findBySlugOrPk(this.vendorId)

    if (isNil(localVendor)) {
      const vendor = await this.getVendor(this.vendorId)
      return await this.upsertVendor(vendor, localVendor)
    } else {
      const ticksSinceUpdate = Date.now() - new Date(localVendor.updatedAt).getTime()
      const hoursSince = ticksSinceUpdate / (1000 * 60 * 60)

      // re lookup vendor if it has been more than 2 hours since last update
      if (hoursSince > 2) {
        const vendor = await this.getVendor(this.vendorId)
        return await this.upsertVendor(vendor, localVendor)
      }
      return localVendor
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async upsertVendor(vendor: any, localVendor: Vendor | null): Promise<Vendor | undefined> {
    if (isNil(vendor) && isNil(localVendor)) return

    if (isNil(vendor) && !isNil(localVendor)) {
      localVendor.status = Vendor.Statuses.INACTIVE
      localVendor.isActive = false
      await localVendor.save()
      return
    }

    const attributes: VendorCreationAttributes = {}

    attributes.slug = vendor.VendorId
    attributes.status = Vendor.Statuses.ACTIVE
    attributes.org = "YUKON"
    attributes.vendorId = vendor.VendorId
    attributes.name = vendor.VendName
    attributes.shortName = vendor.VendShortName
    attributes.isActive = true
    attributes.isPerson = vendor.VendIsPerson == "1"
    attributes.isPayable = vendor.VendIsPayAllow == "1"

    // _TODO_ investigate null fields
    attributes.addressCity = vendor.VendAddrCity || ""
    attributes.addressLine1 = vendor.VendAddrL1 || ""
    attributes.addressLine2 = vendor.VendAddrL2 || ""
    attributes.addressProvince = vendor.VendAddrProv || ""
    attributes.addressPostal = vendor.VendAddrPost || ""
    attributes.isElectronicPay = vendor.VendPayTypeCode == "E"

    if (isNil(localVendor)) {
      return CreateService.perform(attributes)
    } else {
      // manually set updatedAt to now to avoid sequelize's default behavior and ensure it does a save
      attributes.updatedAt = new Date()
      localVendor.changed("updatedAt", true)
      return UpdateService.perform(localVendor, attributes)
    }
  }

  async findVendor(term: string) {
    if (typeof this.vendorId === "number" || !isNaN(Number(this.vendorId))) {
      return await Vendor.findByPk(this.vendorId)
    }

    const body = { term: term }
    const vendors = await axios
      .post(`${VENDOR_API_URL}/search`, body, { headers: VENDOR_AUTH_HEADER })
      .then(async (resp) => {
        return resp.data.data
      })
      .catch((error) => {
        console.log(error)
        return []
      })

    if (isEmpty(vendors)) {
      return null
    }

    const vendor = vendors.at(0)

    const localVendor = await Vendor.findBySlugOrPk(vendor.VendorId)

    return this.upsertVendor(vendor, localVendor)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getVendor(vendorId: string): Promise<any | undefined> {
    return axios
      .get(`${VENDOR_API_URL}/${vendorId}`, { headers: VENDOR_AUTH_HEADER })
      .then(async (resp) => {
        if (resp.data.meta.item_count !== 1) return

        return resp.data.data.at(0)
      })
      .catch((error) => {
        console.log(error)
        return
      })
  }
}
