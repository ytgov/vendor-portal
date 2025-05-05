import { pick } from "lodash"

import { VendorDocumentation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type VendorDocumentationIndexView = Pick<
  VendorDocumentation,
  | "id"
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
>

export class IndexSerializer extends BaseSerializer<VendorDocumentation> {
  perform(): VendorDocumentationIndexView {
    return {
      ...pick(this.record, [
        "id",
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
      ]),
    }
  }
}

export default IndexSerializer
