import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { ProgramDocumentation } from "@/models"
import { ProgramDocumentationsPolicy } from "@/policies/program-documentations-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/program-documentations"
import { IndexSerializer } from "@/serializers/program-documentations"

export class ProgramDocumentationsController extends BaseController<ProgramDocumentation> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedProgramDocumentations = ProgramDocumentationsPolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedProgramDocumentations.count({ where })
      const programDocumentations = await scopedProgramDocumentations.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["documentation"],
      })

      const serializedProgramDocumentations = IndexSerializer.perform(programDocumentations)

      return this.response.json({
        programDocumentations: serializedProgramDocumentations,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching programDocumentations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching programDocumentations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const programDocumentation = await this.loadProgramDocumentation()
      if (isNil(programDocumentation)) {
        return this.response.status(404).json({
          message: "ProgramDocumentation not found",
        })
      }

      const policy = this.buildPolicy(programDocumentation)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this programDocumentation." })
      }

      return this.response.json({ programDocumentation })
    } catch (error) {
      logger.error(`Error fetching programDocumentation: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching programDocumentation: ${error}`,
      })
    }
  }

  async create() {
    try {
      const programDocumentation = await this.buildProgramDocumentation()

      const policy = this.buildPolicy(programDocumentation)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this programDocumentation." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newProgramDocumentation = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ programDocumentation: newProgramDocumentation })
    } catch (error) {
      logger.error(`ProgramDocumentation creation failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `ProgramDocumentation creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const programDocumentation = await this.loadProgramDocumentation()

      if (isNil(programDocumentation)) {
        return this.response.status(404).json({
          message: `ProgramDocumentation not found`,
        })
      }

      const policy = this.buildPolicy(programDocumentation)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this programDocumentation." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newProgramDocumentation = await UpdateService.perform(
        programDocumentation,
        permitAttributes
      )
      return this.response.json({ programDocumentation: newProgramDocumentation })
    } catch (error) {
      logger.error(`ProgramDocumentation update failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `ProgramDocumentation update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const programDocumentation = await this.loadProgramDocumentation()
      if (isNil(programDocumentation)) {
        return this.response.status(404).json({ message: "ProgramDocumentation not found." })
      }

      const policy = this.buildPolicy(programDocumentation)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this programDocumentation." })
      }

      await DestroyService.perform(programDocumentation, this.currentUser)
      return this.response.status(204).json({ message: "ProgramDocumentation was deleted" })
    } catch (error) {
      logger.error(`ProgramDocumentation deletion failed: ${error}`, { error })
      return this.response
        .status(422)
        .json({ message: `ProgramDocumentation deletion failed: ${error}` })
    }
  }

  private async buildProgramDocumentation() {
    return ProgramDocumentation.build(this.request.body)
  }

  private async loadProgramDocumentation(): Promise<ProgramDocumentation | null> {
    return ProgramDocumentation.findByPk(this.params.programDocumentationId, {
      include: ["documentation"],
    })
  }

  private buildPolicy(programDocumentation: ProgramDocumentation) {
    return new ProgramDocumentationsPolicy(this.currentUser, programDocumentation)
  }
}

export default ProgramDocumentationsController
