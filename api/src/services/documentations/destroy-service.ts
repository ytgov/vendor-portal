import { User, Documentation } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private documentation: Documentation
  private currentUser: User

  constructor(documentation: Documentation, currentUser: User) {
    super()
    this.documentation = documentation
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
