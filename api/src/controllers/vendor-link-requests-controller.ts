import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { VendorLinkRequest } from "@/models"
import { VendorLinkRequestsPolicy } from "@/policies/vendor-link-requests-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/vendor-link-requests"
import { IndexSerializer } from "@/serializers/vendor-link-requests"

export class VendorLinkRequestsController extends BaseController<VendorLinkRequest> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedVendorLinkRequests = VendorLinkRequestsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedVendorLinkRequests.count({ where })
      const vendorLinkRequests = await scopedVendorLinkRequests.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["user"],
      })

      const serializedVendorLinkRequests = IndexSerializer.perform(vendorLinkRequests)

      return this.response.json({
        vendorLinkRequests: serializedVendorLinkRequests,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching vendorLinkRequests: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorLinkRequests: ${error}`,
      })
    }
  }

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
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this vendorLinkRequest." })
      }

      return this.response.json({ vendorLinkRequest })
    } catch (error) {
      logger.error(`Error fetching vendorLinkRequest: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorLinkRequest: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendorLinkRequest = await this.buildVendorLinkRequest()

      const policy = this.buildPolicy(vendorLinkRequest)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this vendorLinkRequest." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newVendorLinkRequest = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ vendorLinkRequest: newVendorLinkRequest })
    } catch (error) {
      logger.error(`VendorLinkRequest creation failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorLinkRequest creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendorLinkRequest = await this.loadVendorLinkRequest()

      if (isNil(vendorLinkRequest)) {
        return this.response.status(404).json({
          message: `VendorLinkRequest not found`,
        })
      }

      const policy = this.buildPolicy(vendorLinkRequest)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this vendorLinkRequest." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newVendorLinkRequest = await UpdateService.perform(
        vendorLinkRequest,
        permitAttributes,
        this.currentUser
      )
      return this.response.json({ vendorLinkRequest: newVendorLinkRequest })
    } catch (error) {
      logger.error(`VendorLinkRequest update failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorLinkRequest update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const vendorLinkRequest = await this.loadVendorLinkRequest()
      if (isNil(vendorLinkRequest)) {
        return this.response.status(404).json({ message: "VendorLinkRequest not found." })
      }

      const policy = this.buildPolicy(vendorLinkRequest)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this vendorLinkRequest." })
      }

      await DestroyService.perform(vendorLinkRequest, this.currentUser)
      return this.response.status(204).json({ message: "VendorLinkRequest was deleted" })
    } catch (error) {
      logger.error(`VendorLinkRequest deletion failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorLinkRequest deletion failed: ${error}` })
    }
  }

  private async buildVendorLinkRequest() {
    return VendorLinkRequest.build(this.request.body)
  }

  private async loadVendorLinkRequest(): Promise<VendorLinkRequest | null> {
    return VendorLinkRequest.findByPk(this.params.vendorLinkRequestId)
  }

  private buildPolicy(vendorLinkRequest: VendorLinkRequest) {
    return new VendorLinkRequestsPolicy(this.currentUser, vendorLinkRequest)
  }
}

export default VendorLinkRequestsController
