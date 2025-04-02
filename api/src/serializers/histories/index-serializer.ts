import { pick } from "lodash"

import { History } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type HistoryIndexView = Pick<
  History,
  "id" | "entityId" | "entityType" | "title" | "subtitle" | "details"
>

export class IndexSerializer extends BaseSerializer<History> {
  perform(): HistoryIndexView {
    return {
      ...pick(this.record, ["id", "entityId", "entityType", "title", "subtitle", "details"]),
    }
  }
}

export default IndexSerializer
