import { User, ProgramUser } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private programUser: ProgramUser
  private currentUser: User

  constructor(programUser: ProgramUser, currentUser: User) {
    super()
    this.programUser = programUser
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
