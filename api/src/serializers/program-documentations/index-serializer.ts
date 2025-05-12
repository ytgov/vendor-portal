import { isUndefined, pick } from "lodash"

import { ProgramDocumentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import {
  ShowSerializer as DocumentationShowSerializer,
  DocumentationShowView,
} from "@/serializers/documentations/show-serializer"

export type ProgramDocumentationIndexView = Pick<
  ProgramDocumentation,
  "id" | "programId" | "documentationId" | "purpose" | "updatedAt" | "createdAt"
> & {
  documentation?: DocumentationShowView
}

export class IndexSerializer extends BaseSerializer<ProgramDocumentation> {
  perform(): ProgramDocumentationIndexView {
    if (isUndefined(this.record.documentation)) {
      throw new Error("Documentation must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, [
        "id",
        "programId",
        "documentationId",
        "purpose",
        "updatedAt",
        "createdAt",
      ]),
      documentation: DocumentationShowSerializer.perform(this.record.documentation),
    }
  }
}

export default IndexSerializer
