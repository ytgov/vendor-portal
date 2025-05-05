import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Vendor } from "@/models"
import { VendorsPolicy } from "@/policies/vendors-policy"
import { IndexSerializer } from "@/serializers/vendors"
import { VendorSearchService } from "@/services/vendors/vendor-search-service"

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
      const vendor = await VendorSearchService.perform(this.params.vendorId)
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

  private buildPolicy(vendor: Vendor) {
    return new VendorsPolicy(this.currentUser, vendor)
  }
}

export default VendorsController
