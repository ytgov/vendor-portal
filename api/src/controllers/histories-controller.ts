import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"

import { History } from "@/models"
import { HistoriesPolicy } from "@/policies/histories-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/histories"
import { IndexSerializer } from "@/serializers/histories"

export class HistoriesController extends BaseController<History> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedHistories = HistoriesPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedHistories.count({ where })
      const histories = await scopedHistories.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })

      const serializedHistories = IndexSerializer.perform(histories)

      return this.response.json({
        histories: serializedHistories,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching histories: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching histories: ${error}`,
      })
    }
  }

  async show() {
    try {
      const history = await this.loadHistory()
      if (isNil(history)) {
        return this.response.status(404).json({
          message: "History not found",
        })
      }

      const policy = this.buildPolicy(history)
      if (!policy.show()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to view this history." })
      }

      return this.response.json({ history })
    } catch (error) {
      logger.error(`Error fetching history: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching history: ${error}`,
      })
    }
  }

  async create() {
    try {
      const history = await this.buildHistory()

      const policy = this.buildPolicy(history)
      if (!policy.create()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to create this history." })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newHistory = await CreateService.perform(permittedAttributes)
      return this.response.status(201).json({ history: newHistory })
    } catch (error) {
      logger.error(`History creation failed: ${error}`, { error })
      return this.response.status(422).json({ message: `History creation failed: ${error}` })
    }
  }

  async update() {
    try {
      const history = await this.loadHistory()

      if (isNil(history)) {
        return this.response.status(404).json({
          message: `History not found`,
        })
      }

      const policy = this.buildPolicy(history)
      if (!policy.update()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to update this history." })
      }

      const permitAttributes = policy.permitAttributes(this.request.body)
      const newHistory = await UpdateService.perform(history, permitAttributes)
      return this.response.json({ history: newHistory })
    } catch (error) {
      logger.error(`History update failed: ${error}`, { error })
      return this.response.status(422).json({ message: `History update failed: ${error}` })
    }
  }

  async destroy() {
    try {
      const history = await this.loadHistory()
      if (isNil(history)) {
        return this.response.status(404).json({ message: "History not found." })
      }

      const policy = this.buildPolicy(history)
      if (!policy.destroy()) {
        return this.response
          .status(403)
          .json({ message: "You are not authorized to destroy this history." })
      }

      await DestroyService.perform(history, this.currentUser)
      return this.response.status(204).json({ message: "History was deleted" })
    } catch (error) {
      logger.error(`History deletion failed: ${error}`, { error })
      return this.response.status(422).json({ message: `History deletion failed: ${error}` })
    }
  }

  private async buildHistory() {
    return History.build(this.request.body)
  }

  private async loadHistory(): Promise<History | null> {
    return History.findByPk(this.params.historyId)
  }

  private buildPolicy(history: History) {
    return new HistoriesPolicy(this.currentUser, history)
  }
}

export default HistoriesController
