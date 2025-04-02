import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Documentation } from "@/models"
import { DocumentationsPolicy } from "@/policies/documentations-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/documentations"
import { IndexSerializer } from "@/serializers/documentations"

export class DocumentationsController extends BaseController<Documentation> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedDocumentations = DocumentationsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedDocumentations.count({ where })
      const documentations = await scopedDocumentations.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedDocumentations = IndexSerializer.perform(documentations)

      return this.response.json({
        documentations: serializedDocumentations,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching documentations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching documentations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const documentation = await this.loadDocumentation()
      if (isNil(documentation)) {
        return this.response.status(404).json({
          message: "Documentation not found",
        })
      }

      const policy = this.buildPolicy(documentation)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this documentation." })
      }

      return this.response.json({ documentation })
    } catch (error) {
      logger.error(`Error fetching documentation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching documentation: ${error}`,
      })
    }
  }

  async create() {
    try {
      const documentation = await this.buildDocumentation()

      const policy = this.buildPolicy(documentation)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this documentation." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newDocumentation = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ documentation: newDocumentation })
    } catch (error) {
      logger.error(`Documentation creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Documentation creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const documentation = await this.loadDocumentation()

      if (isNil(documentation)) {
        return this.response.status(404).json({
          message: `Documentation not found`,
        })
      }

      const policy = this.buildPolicy(documentation)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this documentation." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newDocumentation = await UpdateService.perform(documentation, permitAttributes)
      return this.response.json({ documentation: newDocumentation })
    } catch (error) {
      logger.error(`Documentation update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Documentation update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const documentation = await this.loadDocumentation()
      if (isNil(documentation)) {
        return this.response.status(404).json({ message: "Documentation not found." })
      }

      const policy = this.buildPolicy(documentation)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this documentation." })
      }

      await DestroyService.perform(documentation, this.currentUser)
      return this.response.status(204).json({ message: "Documentation was deleted" })
    } catch (error) {
      logger.error(`Documentation deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Documentation deletion failed: ${error}` })
    }
  }

  private async buildDocumentation() {
    return Documentation.build(this.request.body)
  }

  private async loadDocumentation(): Promise<Documentation | null> {
    return Documentation.findByPk(this.params.documentationId)
  }

  private buildPolicy(documentation: Documentation) {
    return new DocumentationsPolicy(this.currentUser, documentation)
  }
}

export default DocumentationsController
