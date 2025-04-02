import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { ProgramUser } from "@/models"
import { ProgramUsersPolicy } from "@/policies/program-users-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/program-users"
import { IndexSerializer } from "@/serializers/program-users"

export class ProgramUsersController extends BaseController<ProgramUser> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedProgramUsers = ProgramUsersPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedProgramUsers.count({ where })
      const programUsers = await scopedProgramUsers.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedProgramUsers = IndexSerializer.perform(programUsers)

      return this.response.json({
        programUsers: serializedProgramUsers,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching programUsers: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching programUsers: ${error}`,
      })
    }
  }

  async show() {
    try {
      const programUser = await this.loadProgramUser()
      if (isNil(programUser)) {
        return this.response.status(404).json({
          message: "ProgramUser not found",
        })
      }

      const policy = this.buildPolicy(programUser)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this programUser." })
      }

      return this.response.json({ programUser })
    } catch (error) {
      logger.error(`Error fetching programUser: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching programUser: ${error}`,
      })
    }
  }

  async create() {
    try {
      const programUser = await this.buildProgramUser()

      const policy = this.buildPolicy(programUser)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this programUser." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newProgramUser = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ programUser: newProgramUser })
    } catch (error) {
      logger.error(`ProgramUser creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `ProgramUser creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const programUser = await this.loadProgramUser()

      if (isNil(programUser)) {
        return this.response.status(404).json({
          message: `ProgramUser not found`,
        })
      }

      const policy = this.buildPolicy(programUser)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this programUser." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newProgramUser = await UpdateService.perform(programUser, permitAttributes)
      return this.response.json({ programUser: newProgramUser })
    } catch (error) {
      logger.error(`ProgramUser update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `ProgramUser update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const programUser = await this.loadProgramUser()
      if (isNil(programUser)) {
        return this.response.status(404).json({ message: "ProgramUser not found." })
      }

      const policy = this.buildPolicy(programUser)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this programUser." })
      }

      await DestroyService.perform(programUser, this.currentUser)
      return this.response.status(204).json({ message: "ProgramUser was deleted" })
    } catch (error) {
      logger.error(`ProgramUser deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `ProgramUser deletion failed: ${error}` })
    }
  }

  private async buildProgramUser() {
    return ProgramUser.build(this.request.body)
  }

  private async loadProgramUser(): Promise<ProgramUser | null> {
    return ProgramUser.findByPk(this.params.programUserId)
  }

  private buildPolicy(programUser: ProgramUser) {
    return new ProgramUsersPolicy(this.currentUser, programUser)
  }
}

export default ProgramUsersController
