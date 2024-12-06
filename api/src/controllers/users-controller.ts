import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { CreateService } from "@/services/users"
import { IndexSerializer } from "@/serializers/users"
import BaseController from "@/controllers/base-controller"

export class UsersController extends BaseController<User> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedUsers = UsersPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedUsers.count({ where })
      const users = await scopedUsers.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedUsers = IndexSerializer.perform(users)
      return this.response.json({
        users: serializedUsers,
        totalCount,
      })
    } catch (error) {
      logger.error("Error fetching users" + error)
      return this.response.status(400).json({
        message: `Error fetching users: ${error}`,
      })
    }
  }

  async show() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this user",
        })
      }

      return this.response.json({ user, policy })
    } catch (error) {
      logger.error("Error fetching user" + error)
      return this.response.status(400).json({
        message: `Error fetching user: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create users",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const user = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ user })
    } catch (error) {
      logger.error("Error creating user" + error)
      return this.response.status(422).json({
        message: `Error creating user: ${error}`,
      })
    }
  }

  async update() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this user",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await user.update(permittedAttributes)
      return this.response.json({ user })
    } catch (error) {
      logger.error("Error updating user" + error)
      return this.response.status(422).json({
        message: `Error updating user: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this user",
        })
      }

      await user.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error("Error deleting user" + error)
      return this.response.status(422).json({
        message: `Error deleting user: ${error}`,
      })
    }
  }

  private async loadUser() {
    return User.findByPk(this.params.id)
  }

  private buildPolicy(user: User = User.build()) {
    return new UsersPolicy(this.currentUser, user)
  }
}

export default UsersController
