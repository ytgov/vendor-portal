import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  type NonAttribute,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import Documentation from "@/models/documentation"

export class ProgramDocumentation extends BaseModel<
  InferAttributes<ProgramDocumentation>,
  InferCreationAttributes<ProgramDocumentation>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare programId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare documentationId: number

  @Attribute(DataTypes.STRING(500))
  declare purpose: CreationOptional<string>

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
  @BelongsTo(() => Documentation, {
    foreignKey: { allowNull: false, name: "documentationId" },
    inverse: {
      as: "programDocumentations",
      type: "hasMany",
    },
  })
  declare documentation?: NonAttribute<Documentation>

  // Scopes
  static establishScopes(): void {}
}

export default ProgramDocumentation
