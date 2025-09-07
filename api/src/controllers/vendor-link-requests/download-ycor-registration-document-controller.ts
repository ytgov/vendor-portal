import { isNil } from "lodash"

import logger from "@/utils/logger"

import { VendorLinkRequest } from "@/models"
import { VendorLinkRequestsPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class DownloadYcorRegistrationDocumentController extends BaseController<VendorLinkRequest> {
  async show() {
    try {
      const vendorLinkRequest = await this.loadVendorLinkRequest()
      if (isNil(vendorLinkRequest)) {
        return this.response.status(404).json({
          message: "VendorLinkRequest not found",
        })
      }

      const policy = this.buildPolicy(vendorLinkRequest)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to download this ycor registration document",
        })
      }

      this.response.setHeader(
        "Content-Disposition",
        `attachment;filename="${vendorLinkRequest.ycorRegistrationDocumentFileName}"`
      )
      this.response.setHeader("Content-Type", vendorLinkRequest.ycorRegistrationDocumentMimeType)

      return this.response.send(vendorLinkRequest.ycorRegistrationDocumentContent)
    } catch (error) {
      logger.error(`Error downloading ycor registration document: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error downloading ycor registration document: ${error}`,
      })
    }
  }

  private async loadVendorLinkRequest() {
    return VendorLinkRequest.findByPk(this.params.vendorLinkRequestId)
  }

  private buildPolicy(vendorLinkRequest: VendorLinkRequest = VendorLinkRequest.build()) {
    return new VendorLinkRequestsPolicy(this.currentUser, vendorLinkRequest)
  }
}

export default DownloadYcorRegistrationDocumentController
