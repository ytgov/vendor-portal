import { User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private user: User
  private currentUser: User

  constructor(user: User, currentUser: User) {
    super()
    this.user = user
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
