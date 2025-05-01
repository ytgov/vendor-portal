import { pick } from "lodash"

import { Vendor } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type VendorIndexView = Pick<
  Vendor,
  | "id"
  | "slug"
  | "status"
  | "org"
  | "vendorId"
  | "name"
  | "shortName"
  | "isActive"
  | "isPerson"
  | "isPayable"
  | "isElectronicPay"
  | "addressLine1"
  | "addressLine2"
  | "addressProvince"
  | "addressPostal"
  | "updatedAt"
  | "createdAt"
>

export class IndexSerializer extends BaseSerializer<Vendor> {
  perform(): VendorIndexView {
    return {
      ...pick(this.record, [
        "id",
        "slug",
        "status",
        "org",
        "vendorId",
        "name",
        "shortName",
        "isActive",
        "isPerson",
        "isPayable",
        "isElectronicPay",
        "addressLine1",
        "addressLine2",
        "addressProvince",
        "addressPostal",
        "updatedAt",
        "createdAt",
      ]),
    }
  }
}

export default IndexSerializer
