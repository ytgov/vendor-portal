import { pick } from "lodash"

import { VendorProgram } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type VendorProgramIndexView = Pick<
  VendorProgram,
  | "id"
  | "vendorId"
  | "programId"
  | "startDate"
  | "endDate"
  | "requestedByUserId"
  | "requestedAt"
  | "status"
  | "reviewByUserId"
  | "reviewAt"
  | "reviewNotes"
>

export class IndexSerializer extends BaseSerializer<VendorProgram> {
  perform(): VendorProgramIndexView {
    return {
      ...pick(this.record, [
        "id",
        "vendorId",
        "programId",
        "startDate",
        "endDate",
        "requestedByUserId",
        "requestedAt",
        "status",
        "reviewByUserId",
        "reviewAt",
        "reviewNotes",
      ]),
    }
  }
}

export default IndexSerializer
