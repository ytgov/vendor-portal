import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { Program } from "@/models"
import { ProgramsPolicy } from "@/policies/programs-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/programs"
import { IndexSerializer } from "@/serializers/programs"

export class ProgramsController extends BaseController<Program> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedPrograms = ProgramsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedPrograms.count({ where })
      const programs = await scopedPrograms.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedPrograms = IndexSerializer.perform(programs)

      return this.response.json({
        programs: serializedPrograms,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching programs: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching programs: ${error}`,
      })
    }
  }

  async show() {
    try {
      const program = await this.loadProgram()
      if (isNil(program)) {
        return this.response.status(404).json({
          message: "Program not found",
        })
      }

      const policy = this.buildPolicy(program)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this program." })
      }

      return this.response.json({ program })
    } catch (error) {
      logger.error(`Error fetching program: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching program: ${error}`,
      })
    }
  }

  async create() {
    try {
      const program = await this.buildProgram()

      const policy = this.buildPolicy(program)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this program." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)

      const newProgram = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ program: newProgram })
    } catch (error) {
      logger.error(`Program creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Program creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const program = await this.loadProgram()

      if (isNil(program)) {
        return this.response.status(404).json({
          message: `Program not found`,
        })
      }

      const policy = this.buildPolicy(program)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this program." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)

      const newProgram = await UpdateService.perform(program, permitAttributes)
      return this.response.json({ program: newProgram })
    } catch (error) {
      logger.error(`Program update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Program update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const program = await this.loadProgram()
      if (isNil(program)) {
        return this.response.status(404).json({ message: "Program not found." })
      }

      const policy = this.buildPolicy(program)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this program." })
      }

      await DestroyService.perform(program, this.currentUser)
      return this.response.status(204).json({ message: "Program was deleted" })
    } catch (error) {
      logger.error(`Program deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `Program deletion failed: ${error}` })
    }
  }

  private async buildProgram() {
    return Program.build(this.request.body)
  }

  private async loadProgram(): Promise<Program | null> {
    return Program.findByPk(this.params.programId)
  }

  private buildPolicy(program: Program) {
    return new ProgramsPolicy(this.currentUser, program)
  }
}

export default ProgramsController
