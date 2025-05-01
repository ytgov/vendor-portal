import { pick } from "lodash"

import { Documentation } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type DocumentationShowView = Pick<
  Documentation,
  "name" | "description" | "format" | "updatedAt" | "createdAt"
>

export class ShowSerializer extends BaseSerializer<Documentation> {
  perform(): DocumentationShowView {
    return {
      ...pick(this.record, ["name", "description", "format", "updatedAt", "createdAt"]),
    }
  }
}

export default ShowSerializer
