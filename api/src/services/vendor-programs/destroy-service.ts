import { User, VendorProgram } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private vendorProgram: VendorProgram
  private currentUser: User

  constructor(vendorProgram: VendorProgram, currentUser: User) {
    super()
    this.vendorProgram = vendorProgram
    this.currentUser = currentUser
  }

  async perform() {
    throw new Error("Not implemented")
  }
}

export default DestroyService
