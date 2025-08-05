import { isNil } from "lodash"
import axios from "axios"

import BaseController from "@/controllers/base-controller"
import { Vendor } from "@/models"
import { VendorsPolicy } from "@/policies"
import { VendorSearchService } from "@/services/vendors"
import logger from "@/utils/logger"
import { PSLR_API_URL } from "@/config"

export class PSLRSubmissionController extends BaseController {
  async index() {
    try {
      const vendor = await this.loadVendor()
      if (isNil(vendor)) {
        return this.response.status(404).json({
          message: "Vendor not found",
        })
      }

      const policy = this.buildPolicy(vendor)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this vendor." })
      }

      console.log("Fetching PSLR submissions for vendor:", this.params.vendorId)
      console.log("Request method:", this.request.method)

      const proxy = axios.create({
        method: this.request.method,
        baseURL: PSLR_API_URL,
        headers: {},
      })
      const response = await proxy.request({
        url: `/submissions/${this.params.vendorId}`,
        data: this.request.body,
      })

      return this.response.status(200).json(response.data)
    } catch (error) {
      console.log("ERROR", error)

      logger.error(`Error fetching submissions: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching submissions: ${error}`,
      })
    }
  }

  private async loadVendor() {
    return VendorSearchService.perform(this.params.vendorId)
  }

  private buildPolicy(vendor: Vendor) {
    return new VendorsPolicy(this.currentUser, vendor)
  }
}

export default PSLRSubmissionController
