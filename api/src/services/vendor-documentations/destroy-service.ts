import { User, VendorDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private vendorDocumentation: VendorDocumentation
  private currentUser: User

  constructor(vendorDocumentation: VendorDocumentation, currentUser: User) {
    super()
    this.vendorDocumentation = vendorDocumentation
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
