import { pick } from "lodash"

import { Vendor } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type VendorShowView = Pick<
  Vendor,
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

export class ShowSerializer extends BaseSerializer<Vendor> {
  perform(): VendorShowView {
    return {
      ...pick(this.record, [
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

export default ShowSerializer
