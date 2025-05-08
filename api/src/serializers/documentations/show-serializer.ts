import { pick } from "lodash"

import { Documentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type DocumentationShowView = Pick<
  Documentation,
  "id" | "name" | "description" | "format" | "updatedAt" | "createdAt"
>

export class ShowSerializer extends BaseSerializer<Documentation> {
  perform(): DocumentationShowView {
    return {
      ...pick(this.record, ["id", "name", "description", "format", "updatedAt", "createdAt"]),
    }
  }
}

export default ShowSerializer
