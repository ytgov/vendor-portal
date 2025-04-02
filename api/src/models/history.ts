import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

export class History extends BaseModel<InferAttributes<History>, InferCreationAttributes<History>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare entityId: number

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare entityType: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare title: string

  @Attribute(DataTypes.STRING(400))
  declare subtitle: CreationOptional<number>

  @Attribute(DataTypes.TEXT)
  declare details: CreationOptional<string>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Magic Attributes

  // Associations

  // Scopes
  static establishScopes(): void {}
}

export default History
