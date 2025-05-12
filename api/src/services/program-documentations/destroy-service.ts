import { User, ProgramDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private programDocumentation: ProgramDocumentation
  private currentUser: User

  constructor(programDocumentation: ProgramDocumentation, currentUser: User) {
    super()
    this.programDocumentation = programDocumentation
    this.currentUser = currentUser
  }

  async perform() {
    await this.programDocumentation.destroy()
  }
}

export default DestroyService
