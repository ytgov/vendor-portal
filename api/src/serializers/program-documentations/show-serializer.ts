import { isUndefined, pick } from "lodash"

import { ProgramDocumentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import { DocumentationShowView } from "@/serializers/documentations/show-serializer"

export type ProgramDocumentationShowView = Pick<
  ProgramDocumentation,
  "programId" | "documentationId" | "purpose" | "updatedAt" | "createdAt"
> & {
  documentation?: DocumentationShowView
}

export class ShowSerializer extends BaseSerializer<ProgramDocumentation> {
  perform(): ProgramDocumentationShowView {
    if (isUndefined(this.record.documentation)) {
      throw new Error("Program documentation must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, ["programId", "documentationId", "purpose", "updatedAt", "createdAt"]),
    }
  }
}

export default ShowSerializer
