import { isNil } from "lodash"

import logger from "@/utils/logger"

import { VendorDocumentation } from "@/models"
import { VendorDocumentationsPolicy } from "@/policies"

import BaseController from "@/controllers/base-controller"

export class DownloadController extends BaseController<VendorDocumentation> {
  async create() {
    try {
      const vendorDocumentation = await this.loadVendorDocumentation()
      if (isNil(vendorDocumentation)) {
        return this.response.status(404).json({
          message: "Vendor documentation not found",
        })
      }

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to download this vendor documentation",
        })
      }

      this.response.setHeader(
        "Content-Disposition",
        `attachment;filename="${vendorDocumentation.fileName}"`
      )
      this.response.setHeader("Content-Type", vendorDocumentation.mimeType)

      return this.response.send(vendorDocumentation.content)
    } catch (error) {
      logger.error(`Error downloading vendor documentation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error downloading vendor documentation: ${error}`,
      })
    }
  }

  async show() {
    try {
      const vendorDocumentation = await this.loadVendorDocumentation()
      if (isNil(vendorDocumentation)) {
        return this.response.status(404).json({
          message: "Vendor documentation not found",
        })
      }

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to download this vendor documentation",
        })
      }

      this.response.setHeader(
        "Content-Disposition",
        `attachment;filename="${vendorDocumentation.fileName}"`
      )
      this.response.setHeader("Content-Type", vendorDocumentation.mimeType)

      return this.response.send(vendorDocumentation.content)
    } catch (error) {
      logger.error(`Error downloading vendor documentation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error downloading vendor documentation: ${error}`,
      })
    }
  }

  private async loadVendorDocumentation() {
    return VendorDocumentation.findByPk(this.params.vendorDocumentationId)
  }

  private buildPolicy(vendorDocumentation: VendorDocumentation = VendorDocumentation.build()) {
    return new VendorDocumentationsPolicy(this.currentUser, vendorDocumentation)
  }
}

export default DownloadController
