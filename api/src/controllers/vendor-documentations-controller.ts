import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { VendorDocumentation } from "@/models"
import { VendorDocumentationsPolicy } from "@/policies/vendor-documentations-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/vendor-documentations"
import { IndexSerializer } from "@/serializers/vendor-documentations"

export class VendorDocumentationsController extends BaseController<VendorDocumentation> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedVendorDocumentations = VendorDocumentationsPolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedVendorDocumentations.count({ where })
      const vendorDocumentations = await scopedVendorDocumentations.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedVendorDocumentations = IndexSerializer.perform(vendorDocumentations)

      return this.response.json({
        vendorDocumentations: serializedVendorDocumentations,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching vendorDocumentations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorDocumentations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const vendorDocumentation = await this.loadVendorDocumentation()
      if (isNil(vendorDocumentation)) {
        return this.response.status(404).json({
          message: "VendorDocumentation not found",
        })
      }

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this vendorDocumentation." })
      }

      return this.response.json({ vendorDocumentation })
    } catch (error) {
      logger.error(`Error fetching vendorDocumentation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorDocumentation: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendorDocumentation = await this.buildVendorDocumentation()

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this vendorDocumentation." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newVendorDocumentation = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ vendorDocumentation: newVendorDocumentation })
    } catch (error) {
      logger.error(`VendorDocumentation creation failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorDocumentation creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendorDocumentation = await this.loadVendorDocumentation()

      if (isNil(vendorDocumentation)) {
        return this.response.status(404).json({
          message: `VendorDocumentation not found`,
        })
      }

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this vendorDocumentation." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newVendorDocumentation = await UpdateService.perform(
        vendorDocumentation,
        permitAttributes
      )
      return this.response.json({ vendorDocumentation: newVendorDocumentation })
    } catch (error) {
      logger.error(`VendorDocumentation update failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorDocumentation update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const vendorDocumentation = await this.loadVendorDocumentation()
      if (isNil(vendorDocumentation)) {
        return this.response.status(404).json({ message: "VendorDocumentation not found." })
      }

      const policy = this.buildPolicy(vendorDocumentation)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this vendorDocumentation." })
      }

      await DestroyService.perform(vendorDocumentation, this.currentUser)
      return this.response.status(204).json({ message: "VendorDocumentation was deleted" })
    } catch (error) {
      logger.error(`VendorDocumentation deletion failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `VendorDocumentation deletion failed: ${error}` })
    }
  }

  private async buildVendorDocumentation() {
    return VendorDocumentation.build(this.request.body)
  }

  private async loadVendorDocumentation(): Promise<VendorDocumentation | null> {
    return VendorDocumentation.findByPk(this.params.vendorDocumentationId)
  }

  private buildPolicy(vendorDocumentation: VendorDocumentation) {
    return new VendorDocumentationsPolicy(this.currentUser, vendorDocumentation)
  }
}

export default VendorDocumentationsController
