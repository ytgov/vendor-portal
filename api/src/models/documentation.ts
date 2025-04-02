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

export class Documentation extends BaseModel<
  InferAttributes<Documentation>,
  InferCreationAttributes<Documentation>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(500))
  declare description: CreationOptional<string>

  @Attribute(DataTypes.STRING(1000))
  @NotNull
  declare format: string

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

export default Documentation
