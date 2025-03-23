import { pick } from "lodash"

import { ProgramUser } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ProgramUserIndexView = Pick<ProgramUser, "id" | "programId" | "userId" | "roles">

export class IndexSerializer extends BaseSerializer<ProgramUser> {
  perform(): ProgramUserIndexView {
    return {
      ...pick(this.record, ["id", "programId", "userId", "roles"]),
    }
  }
}

export default IndexSerializer
