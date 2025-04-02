import { pick } from "lodash"

import { ProgramUser } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"

export type ProgramUserShowView = Pick<ProgramUser, "programId" | "userId" | "roles">

export class ShowSerializer extends BaseSerializer<ProgramUser> {
  perform(): ProgramUserShowView {
    return {
      ...pick(this.record, ["programId", "userId", "roles"]),
    }
  }
}

export default ShowSerializer
