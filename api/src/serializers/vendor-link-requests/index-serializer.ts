import { pick } from "lodash"

import { VendorLinkRequest } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type VendorLinkRequestIndexView = Pick<
  VendorLinkRequest,
  | "id"
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

export class IndexSerializer extends BaseSerializer<VendorLinkRequest> {
  perform(): VendorLinkRequestIndexView {
    return {
      ...pick(this.record, [
        "id",
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

export default IndexSerializer
