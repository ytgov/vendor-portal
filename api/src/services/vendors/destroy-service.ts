import { User, Vendor } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private vendor: Vendor,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
