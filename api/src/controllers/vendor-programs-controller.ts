import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { VendorProgram } from "@/models"
import { VendorProgramsPolicy } from "@/policies/vendor-programs-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/vendor-programs"
import { IndexSerializer } from "@/serializers/vendor-programs"

export class VendorProgramsController extends BaseController<VendorProgram> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedVendorPrograms = VendorProgramsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedVendorPrograms.count({ where })
      const vendorPrograms = await scopedVendorPrograms.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedVendorPrograms = IndexSerializer.perform(vendorPrograms)

      return this.response.json({
        vendorPrograms: serializedVendorPrograms,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching vendorPrograms: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorPrograms: ${error}`,
      })
    }
  }

  async show() {
    try {
      const vendorProgram = await this.loadVendorProgram()
      if (isNil(vendorProgram)) {
        return this.response.status(404).json({
          message: "VendorProgram not found",
        })
      }

      const policy = this.buildPolicy(vendorProgram)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this vendorProgram." })
      }

      return this.response.json({ vendorProgram })
    } catch (error) {
      logger.error(`Error fetching vendorProgram: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorProgram: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendorProgram = await this.buildVendorProgram()

      const policy = this.buildPolicy(vendorProgram)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this vendorProgram." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newVendorProgram = await CreateService.perform(permittedAttributes, this.currentUser)
      return this.response.status(201).json({ vendorProgram: newVendorProgram })
    } catch (error) {
      logger.error(`VendorProgram creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorProgram creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendorProgram = await this.loadVendorProgram()

      if (isNil(vendorProgram)) {
        return this.response.status(404).json({
          message: `VendorProgram not found`,
        })
      }

      const policy = this.buildPolicy(vendorProgram)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this vendorProgram." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newVendorProgram = await UpdateService.perform(
        vendorProgram,
        permitAttributes,
        this.currentUser
      )
      return this.response.json({ vendorProgram: newVendorProgram })
    } catch (error) {
      logger.error(`VendorProgram update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorProgram update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const vendorProgram = await this.loadVendorProgram()
      if (isNil(vendorProgram)) {
        return this.response.status(404).json({ message: "VendorProgram not found." })
      }

      const policy = this.buildPolicy(vendorProgram)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this vendorProgram." })
      }

      await DestroyService.perform(vendorProgram, this.currentUser)
      return this.response.status(204).json({ message: "VendorProgram was deleted" })
    } catch (error) {
      logger.error(`VendorProgram deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorProgram deletion failed: ${error}` })
    }
  }

  private async buildVendorProgram() {
    return VendorProgram.build(this.request.body)
  }

  private async loadVendorProgram(): Promise<VendorProgram | null> {
    return VendorProgram.findByPk(this.params.vendorProgramId)
  }

  private buildPolicy(vendorProgram: VendorProgram) {
    return new VendorProgramsPolicy(this.currentUser, vendorProgram)
  }
}

export default VendorProgramsController
