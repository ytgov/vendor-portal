import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Vendor } from "@/models"
import { VendorsPolicy } from "@/policies/vendors-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/vendors"
import { IndexSerializer } from "@/serializers/vendors"

export class VendorsController extends BaseController<Vendor> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedVendors = VendorsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedVendors.count({ where })
      const vendors = await scopedVendors.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["programs"],
      })

      const serializedVendors = IndexSerializer.perform(vendors)

      return this.response.json({
        vendors: serializedVendors,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching vendors: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendors: ${error}`,
      })
    }
  }

  async show() {
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

      return this.response.json({ vendor })
    } catch (error) {
      logger.error(`Error fetching vendor: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendor: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendor = await this.buildVendor()

      const policy = this.buildPolicy(vendor)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this vendor." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newVendor = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ vendor: newVendor })
    } catch (error) {
      logger.error(`Vendor creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Vendor creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendor = await this.loadVendor()

      if (isNil(vendor)) {
        return this.response.status(404).json({
          message: `Vendor not found`,
        })
      }

      const policy = this.buildPolicy(vendor)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this vendor." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newVendor = await UpdateService.perform(vendor, permitAttributes)
      return this.response.json({ vendor: newVendor })
    } catch (error) {
      logger.error(`Vendor update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Vendor update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const vendor = await this.loadVendor()
      if (isNil(vendor)) {
        return this.response.status(404).json({ message: "Vendor not found." })
      }

      const policy = this.buildPolicy(vendor)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this vendor." })
      }

      await DestroyService.perform(vendor, this.currentUser)
      return this.response.status(204).json({ message: "Vendor was deleted" })
    } catch (error) {
      logger.error(`Vendor deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Vendor deletion failed: ${error}` })
    }
  }

  private async buildVendor() {
    return Vendor.build(this.request.body)
  }

  private async loadVendor(): Promise<Vendor | null> {
    return Vendor.findByPk(this.params.vendorId)
  }

  private buildPolicy(vendor: Vendor) {
    return new VendorsPolicy(this.currentUser, vendor)
  }
}

export default VendorsController
