import { isUndefined, pick } from "lodash"

import { VendorLinkRequest } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import {
  ShowSerializer as UserShowSerializer,
  UserShowView,
} from "@/serializers/users/show-serializer"

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
> & {
  user?: UserShowView
}

export class ShowSerializer extends BaseSerializer<VendorLinkRequest> {
  perform(): VendorLinkRequestShowView {
    if (isUndefined(this.record.user)) {
      throw new Error("User must be eager loaded for detailed view")
    }

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
      user: UserShowSerializer.perform(this.record.user),
    }
  }
}

export default ShowSerializer
