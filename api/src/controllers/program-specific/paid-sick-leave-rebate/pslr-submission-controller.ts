import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { Vendor } from "@/models"
import { VendorsActionsPolicy } from "@/policies"
import { VendorSearchService } from "@/services/vendors"
import { pslrIntegration } from "@/integrations/program-specific-integrations"

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
          .json({ message: "You are not authorized to view submissions for this vendor." })
      }

      const submissions = await pslrIntegration.getSubmissions(this.params.vendorId)

      console.log("----------- SUBMISSIONS:", submissions)

      return this.response.status(200).json({ submissions: submissions })
    } catch (error) {
      logger.error(`Error fetching submissions: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching submissions: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendor = await this.loadVendor()
      if (isNil(vendor)) {
        return this.response.status(404).json({
          message: "Vendor not found",
        })
      }

      await this.currentUser.reload({ include: ["vendors"] })

      const policy = this.buildPolicy(vendor)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create a pslr submission for this vendor" })
      }

      /* TODO: File upload may not work with the current integration. 
        Pay stub file (File object) is in: this.request.body.pay_stub
      */
      const newSubmission = await pslrIntegration.createSubmission(
        this.params.vendorId,
        this.request.body
      )

      return this.response.status(201).json({ submission: newSubmission })
    } catch (error) {
      logger.error(`PSLR submission creation failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `PSLR submission creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendor = await this.loadVendor()
      if (isNil(vendor)) {
        return this.response.status(404).json({
          message: "Vendor not found",
        })
      }

      // TODO: Seperate policy for vendor submissions?
      const policy = this.buildPolicy(vendor)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update a pslr submission for this vendor" })
      }

      // TODO This is a placeholder for the updateSubmission method
      const updatedSubmission = await pslrIntegration.updateSubmission(
        this.params.vendorId,
        this.params.submissionId,
        this.request.body
      )

      return this.response.status(200).json({ submission: updatedSubmission })
    } catch (error) {
      logger.error(`PSLR submission update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `PSLR submission update failed: ${error}` })
    }
  }

  private async loadVendor() {
    return VendorSearchService.perform(this.params.vendorId)
  }

  private buildPolicy(vendor: Vendor) {
    return new VendorsActionsPolicy(this.currentUser, vendor)
  }
}

export default PSLRSubmissionController
