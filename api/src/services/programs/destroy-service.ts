import { User, Program } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private program: Program
  private currentUser: User

  constructor(program: Program, currentUser: User) {
    super()
    this.program = program
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
