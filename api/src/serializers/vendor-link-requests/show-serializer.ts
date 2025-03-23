import { pick } from "lodash"

import { VendorLinkRequest } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type VendorLinkRequestShowView = Pick<
  VendorLinkRequest,
  | "userId"
  | "matchedVendorId"
  | "businessName"
  | "operatingName"
  | "ycorNumber"
  | "address"
  | "vendorId"
  | "status"
  | "decisionByUserId"
  | "decisionAt"
  | "reviewNotes"
>

export class ShowSerializer extends BaseSerializer<VendorLinkRequest> {
  perform(): VendorLinkRequestShowView {
    return {
      ...pick(this.record, [
        "userId",
        "matchedVendorId",
        "businessName",
        "operatingName",
        "ycorNumber",
        "address",
        "vendorId",
        "status",
        "decisionByUserId",
        "decisionAt",
        "reviewNotes",
      ]),
    }
  }
}

export default ShowSerializer
