import { pick } from "lodash"

import { ProgramDocumentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type ProgramDocumentationShowView = Pick<
  ProgramDocumentation,
  "programId" | "documentationId" | "purpose"
>

export class ShowSerializer extends BaseSerializer<ProgramDocumentation> {
  perform(): ProgramDocumentationShowView {
    return {
      ...pick(this.record, ["programId", "documentationId", "purpose"]),
    }
  }
}

export default ShowSerializer
