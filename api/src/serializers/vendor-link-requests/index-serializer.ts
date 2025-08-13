import { isUndefined, pick } from "lodash"

import { VendorLinkRequest } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

import { ShowSerializer, UserShowView } from "@/serializers/users/show-serializer"

export type VendorLinkRequestIndexView = Pick<
  VendorLinkRequest,
  | "id"
  | "userId"
  | "matchedVendorId"
  | "businessName"
  | "operatingName"
  | "ycorNumber"
  | "mailingAddress"
  | "physicalAddress"
  | "vendorId"
  | "status"
  | "decisionByUserId"
  | "decisionAt"
  | "reviewNotes"
  | "updatedAt"
  | "createdAt"
> & {
  user?: UserShowView
}

export class IndexSerializer extends BaseSerializer<VendorLinkRequest> {
  perform(): VendorLinkRequestIndexView {
    if (isUndefined(this.record.user)) {
      throw new Error("User must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, [
        "id",
        "userId",
        "matchedVendorId",
        "businessName",
        "operatingName",
        "ycorNumber",
        "mailingAddress",
        "physicalAddress",
        "vendorId",
        "status",
        "decisionByUserId",
        "decisionAt",
        "reviewNotes",
        "updatedAt",
        "createdAt",
      ]),
      user: ShowSerializer.perform(this.record.user),
    }
  }
}

export default IndexSerializer
