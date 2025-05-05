import { User, Vendor } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private vendor: Vendor
  private currentUser: User

  constructor(vendor: Vendor, currentUser: User) {
    super()
    this.vendor = vendor
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
