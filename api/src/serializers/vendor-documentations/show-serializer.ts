import { pick } from "lodash"

import { VendorDocumentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type VendorDocumentationShowView = Pick<
  VendorDocumentation,
  | "vendorId"
  | "documentationId"
  | "createdByUserId"
  | "status"
  | "expiresAt"
  | "reviewByUserId"
  | "reviewAt"
  | "reviewNotes"
  | "textValue"
  | "fileName"
  | "mimeType"
  | "size"
  | "content"
>

export class ShowSerializer extends BaseSerializer<VendorDocumentation> {
  perform(): VendorDocumentationShowView {
    return {
      ...pick(this.record, [
        "vendorId",
        "documentationId",
        "createdByUserId",
        "status",
        "expiresAt",
        "reviewByUserId",
        "reviewAt",
        "reviewNotes",
        "textValue",
        "fileName",
        "mimeType",
        "size",
        "content",
      ]),
    }
  }
}

export default ShowSerializer
