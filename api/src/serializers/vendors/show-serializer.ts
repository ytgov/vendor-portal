import { pick } from "lodash"

import { Vendor } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type ProjectShowView = Pick<
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
>

export class ShowSerializer extends BaseSerializer<Vendor> {
  perform(): ProjectShowView {
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
      ]),
    }
  }
}

export default ShowSerializer
