import { pick } from "lodash"
import { Program } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ProgramIndexView = Pick<
  Program,
  | "id"
  | "slug"
  | "startDate"
  | "endDate"
  | "department"
  | "offeredBy"
  | "isActive"
  | "name"
  | "description"
  | "updatedAt"
  | "createdAt"
>

export class IndexSerializer extends BaseSerializer<Program> {
  perform(): ProgramIndexView {
    return {
      ...pick(this.record, [
        "id",
        "slug",
        "startDate",
        "endDate",
        "department",
        "offeredBy",
        "isActive",
        "name",
        "description",
        "updatedAt",
        "createdAt",
      ]),
    }
  }
}

export default IndexSerializer
