import { isUndefined, pick } from "lodash"

import { VendorUser } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import { UserShowView } from "@/serializers/users/show-serializer"
import { VendorShowView } from "@/serializers/vendors/show-serializer"

export type VendorUserShowView = Pick<
  VendorUser,
  | "vendorId"
  | "userId"
  | "isActive"
  | "isAdmin"
  | "decisionByUserId"
  | "decisionAt"
  | "updatedAt"
  | "createdAt"
> & {
  vendor?: VendorShowView
  user?: UserShowView
  decisionByUser?: UserShowView
}

export class ShowSerializer extends BaseSerializer<VendorUser> {
  perform(): VendorUserShowView {
    if (isUndefined(this.record.vendor)) {
      throw new Error("Vendor must be eager loaded for detailed view")
    }

    if (isUndefined(this.record.user)) {
      throw new Error("User must be eager loaded for detailed view")
    }

    if (isUndefined(this.record.decisionByUser)) {
      throw new Error("Decision By User must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, [
        "vendorId",
        "userId",
        "isActive",
        "isAdmin",
        "decisionByUserId",
        "decisionAt",
        "updatedAt",
        "createdAt",
      ]),
    }
  }
}

export default ShowSerializer
