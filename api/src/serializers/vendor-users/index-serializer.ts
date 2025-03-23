import { pick } from "lodash"

import { VendorUser } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type VendorUserIndexView = Pick<
  VendorUser,
  "id" | "vendorId" | "userId" | "isActive" | "isAdmin" | "decisionByUserId" | "decisionAt"
>

export class IndexSerializer extends BaseSerializer<VendorUser> {
  perform(): VendorUserIndexView {
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
    }
  }
}

export default IndexSerializer
