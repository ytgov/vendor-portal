import axios from "axios"
import { isNil } from "lodash"
import { CreationAttributes } from "@sequelize/core"

import { API_GATEWAY_KEY } from "@/config"
import { Vendor } from "@/models/vendor"

import BaseService from "@/services/base-service"
import { UpdateService, CreateService } from "@/services/vendors"

const VENDOR_API_URL = "https://api.gov.yk.ca/finance/api/v1/vendor"
const AUTH_HEADER = { "Ocp-Apim-Subscription-Key": API_GATEWAY_KEY }

export type VendorCreationAttributes = Partial<CreationAttributes<Vendor>>

export class VendorSearchService extends BaseService {
  constructor(private vendorId: string) {
    super()
  }

  async perform() {
    const vendor = await this.getVendor(this.vendorId)

    const localVendor = await Vendor.findBySlugOrPk(this.vendorId)

    return this.upsertVendor(vendor, localVendor)
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
      return UpdateService.perform(localVendor, attributes)
    }
  }

  private async findVendor(term: string) {
    const body = { term: term }
    return axios
      .post(`${VENDOR_API_URL}/search`, body, { headers: AUTH_HEADER })
      .then(async (resp) => {
        return resp.data.data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getVendor(vendorId: string): Promise<any | undefined> {
    return axios
      .get(`${VENDOR_API_URL}/${vendorId}`, { headers: AUTH_HEADER })
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
