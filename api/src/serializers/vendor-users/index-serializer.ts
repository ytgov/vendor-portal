import { isUndefined, pick } from "lodash"

import { VendorUser } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

import {
  ShowSerializer as UserShowSerializer,
  UserShowView,
} from "@/serializers/users/show-serializer"
import {
  ShowSerializer as VendorShowSerializer,
  VendorShowView,
} from "@/serializers/vendors/show-serializer"

export type VendorUserIndexView = Pick<
  VendorUser,
  "id" | "vendorId" | "userId" | "isActive" | "isAdmin" | "decisionByUserId" | "decisionAt"
> & {
  user?: UserShowView
  vendor?: VendorShowView
}

export class IndexSerializer extends BaseSerializer<VendorUser> {
  perform(): VendorUserIndexView {
    if (isUndefined(this.record.user)) {
      throw new Error("User must be eager loaded for detailed view")
    }
    if (isUndefined(this.record.vendor)) {
      throw new Error("Vendor must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, [
        "id",
        "vendorId",
        "userId",
        "isActive",
        "isAdmin",
        "decisionByUserId",
        "decisionAt",
      ]),
      user: UserShowSerializer.perform(this.record.user),
      vendor: VendorShowSerializer.perform(this.record.vendor),
    }
  }
}

export default IndexSerializer
