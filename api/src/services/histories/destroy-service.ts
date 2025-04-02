import { User, History } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private history: History
  private currentUser: User

  constructor(history: History, currentUser: User) {
    super()
    this.history = history
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
