import { pick } from "lodash"

import { Documentation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type DocumentationIndexView = Pick<
  Documentation,
  "id" | "name" | "description" | "format" | "expires" | "updatedAt" | "createdAt"
>

export class IndexSerializer extends BaseSerializer<Documentation> {
  perform(): DocumentationIndexView {
    return {
      ...pick(this.record, [
        "id",
        "name",
        "description",
        "format",
        "expires",
        "updatedAt",
        "createdAt",
      ]),
    }
  }
}

export default IndexSerializer
