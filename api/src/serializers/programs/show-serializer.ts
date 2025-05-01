import { pick } from "lodash"

import { Program } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type ProgramShowView = Pick<
  Program,
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

export class ShowSerializer extends BaseSerializer<Program> {
  perform(): ProgramShowView {
    return {
      ...pick(this.record, [
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

export default ShowSerializer
