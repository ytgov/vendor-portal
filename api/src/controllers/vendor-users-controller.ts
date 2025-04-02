import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { VendorUser } from "@/models"
import { VendorUsersPolicy } from "@/policies/vendor-users-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/vendor-users"
import { IndexSerializer } from "@/serializers/vendor-users"

export class VendorUsersController extends BaseController<VendorUser> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedVendorUsers = VendorUsersPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedVendorUsers.count({ where })
      const vendorUsers = await scopedVendorUsers.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedVendorUsers = IndexSerializer.perform(vendorUsers)

      return this.response.json({
        vendorUsers: serializedVendorUsers,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching vendorUsers: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorUsers: ${error}`,
      })
    }
  }

  async show() {
    try {
      const vendorUser = await this.loadVendorUser()
      if (isNil(vendorUser)) {
        return this.response.status(404).json({
          message: "VendorUser not found",
        })
      }

      const policy = this.buildPolicy(vendorUser)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this vendorUser." })
      }

      return this.response.json({ vendorUser })
    } catch (error) {
      logger.error(`Error fetching vendorUser: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching vendorUser: ${error}`,
      })
    }
  }

  async create() {
    try {
      const vendorUser = await this.buildVendorUser()

      const policy = this.buildPolicy(vendorUser)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this vendorUser." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newVendorUser = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ vendorUser: newVendorUser })
    } catch (error) {
      logger.error(`VendorUser creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorUser creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const vendorUser = await this.loadVendorUser()

      if (isNil(vendorUser)) {
        return this.response.status(404).json({
          message: `VendorUser not found`,
        })
      }

      const policy = this.buildPolicy(vendorUser)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this vendorUser." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newVendorUser = await UpdateService.perform(vendorUser, permitAttributes)
      return this.response.json({ vendorUser: newVendorUser })
    } catch (error) {
      logger.error(`VendorUser update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorUser update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const vendorUser = await this.loadVendorUser()
      if (isNil(vendorUser)) {
        return this.response.status(404).json({ message: "VendorUser not found." })
      }

      const policy = this.buildPolicy(vendorUser)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this vendorUser." })
      }

      await DestroyService.perform(vendorUser, this.currentUser)
      return this.response.status(204).json({ message: "VendorUser was deleted" })
    } catch (error) {
      logger.error(`VendorUser deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `VendorUser deletion failed: ${error}` })
    }
  }

  private async buildVendorUser() {
    return VendorUser.build(this.request.body)
  }

  private async loadVendorUser(): Promise<VendorUser | null> {
    return VendorUser.findByPk(this.params.vendorUserId)
  }

  private buildPolicy(vendorUser: VendorUser) {
    return new VendorUsersPolicy(this.currentUser, vendorUser)
  }
}

export default VendorUsersController
