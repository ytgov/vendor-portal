import { pick } from "lodash"

import { VendorProgram } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type VendorProgramShowView = Pick<
  VendorProgram,
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
  | "updatedAt"
  | "createdAt"
>

export class ShowSerializer extends BaseSerializer<VendorProgram> {
  perform(): VendorProgramShowView {
    return {
      ...pick(this.record, [
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
        "updatedAt",
        "createdAt",
      ]),
    }
  }
}

export default ShowSerializer
