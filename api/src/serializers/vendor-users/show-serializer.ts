import { pick } from "lodash"

import { VendorUser } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type VendorUserShowView = Pick<
  VendorUser,
  "vendorId" | "userId" | "isActive" | "isAdmin" | "decisionByUserId" | "decisionAt"
>

export class ShowSerializer extends BaseSerializer<VendorUser> {
  perform(): VendorUserShowView {
    return {
      ...pick(this.record, [
        "vendorId",
        "userId",
        "isActive",
        "isAdmin",
        "decisionByUserId",
        "decisionAt",
      ]),
    }
  }
}

export default ShowSerializer
