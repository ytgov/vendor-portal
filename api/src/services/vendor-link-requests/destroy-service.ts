import { User, VendorLinkRequest } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private vendorLinkRequest: VendorLinkRequest
  private currentUser: User

  constructor(vendorLinkRequest: VendorLinkRequest, currentUser: User) {
    super()
    this.vendorLinkRequest = vendorLinkRequest
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
