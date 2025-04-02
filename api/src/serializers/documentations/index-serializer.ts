import { pick } from "lodash"

import { Documentation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type DocumentationIndexView = Pick<Documentation, "id" | "name" | "description" | "format">

export class IndexSerializer extends BaseSerializer<Documentation> {
  perform(): DocumentationIndexView {
    return {
      ...pick(this.record, ["id", "name", "description", "format"]),
    }
  }
}

export default IndexSerializer
