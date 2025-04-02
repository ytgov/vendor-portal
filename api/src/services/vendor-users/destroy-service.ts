import { User, VendorUser } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private vendorUser: VendorUser
  private currentUser: User

  constructor(vendorUser: VendorUser, currentUser: User) {
    super()
    this.vendorUser = vendorUser
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
