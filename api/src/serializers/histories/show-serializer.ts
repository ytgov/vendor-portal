import { pick } from "lodash"

import { History } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type HistoryShowView = Pick<
  History,
  "entityId" | "entityType" | "title" | "subtitle" | "details"
>

export class ShowSerializer extends BaseSerializer<History> {
  perform(): HistoryShowView {
    return {
      ...pick(this.record, ["entityId", "entityType", "title", "subtitle", "details"]),
    }
  }
}

export default ShowSerializer
