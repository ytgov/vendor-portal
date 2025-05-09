import { isUndefined, pick } from "lodash"

import { VendorProgram } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import {
  ShowSerializer as UserShowSerializer,
  UserShowView,
} from "@/serializers/users/show-serializer"
import {
  ShowSerializer as ProgramShowSerializer,
  ProgramShowView,
} from "@/serializers/programs/show-serializer"

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
  | "updatedAt"
  | "createdAt"
> & {
  program?: ProgramShowView
  requestedByUser?: UserShowView
  reviewByUser?: UserShowView | null
}

export class IndexSerializer extends BaseSerializer<VendorProgram> {
  perform(): VendorProgramIndexView {
    if (isUndefined(this.record.program)) {
      throw new Error("program must be eager loaded for detailed view")
    }

    if (isUndefined(this.record.requestedByUser)) {
      throw new Error("requestedByUser must be eager loaded for detailed view")
    }

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
        "updatedAt",
        "createdAt",
      ]),
      program: ProgramShowSerializer.perform(this.record.program),
      requestedByUser: UserShowSerializer.perform(this.record.requestedByUser),
      reviewByUser: this.record.reviewByUser
        ? UserShowSerializer.perform(this.record.reviewByUser)
        : null,
    }
  }
}

export default IndexSerializer
