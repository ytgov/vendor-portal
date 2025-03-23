import { pick } from "lodash"

import { ProgramDocumentation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ProgramDocumentationIndexView = Pick<
  ProgramDocumentation,
  "id" | "programId" | "documentationId" | "purpose"
>

export class IndexSerializer extends BaseSerializer<ProgramDocumentation> {
  perform(): ProgramDocumentationIndexView {
    return {
      ...pick(this.record, ["id", "programId", "documentationId", "purpose"]),
    }
  }
}

export default IndexSerializer
