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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import User from "@/models/user"

/** Keep in sync with web/src/api/vendor-documentations-api.ts */
export enum VendorDocumentationStatuses {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export class VendorDocumentation extends BaseModel<
  InferAttributes<VendorDocumentation>,
  InferCreationAttributes<VendorDocumentation>
> {
  static readonly Statuses = VendorDocumentationStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare vendorId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare documentationId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare createdByUserId: number

  @Attribute(DataTypes.STRING(100))
  @ValidateAttribute({
    isIn: {
      args: [Object.values(VendorDocumentationStatuses)],
      msg: `Status must be one of ${Object.values(VendorDocumentationStatuses).join(", ")}`,
    },
  })
  @Default(VendorDocumentationStatuses.PENDING)
  declare status: CreationOptional<string>

  @Attribute(DataTypes.DATE(0))
  declare expiresAt: CreationOptional<Date>

  @Attribute(DataTypes.INTEGER)
  declare reviewByUserId: CreationOptional<number>

  @Attribute(DataTypes.DATE(0))
  declare reviewAt: CreationOptional<Date>

  @Attribute(DataTypes.STRING(2000))
  declare reviewNotes: CreationOptional<string>

  @Attribute(DataTypes.TEXT)
  declare textValue: CreationOptional<string>

  @Attribute(DataTypes.STRING(200))
  declare fileName: CreationOptional<string>

  @Attribute(DataTypes.STRING(200))
  declare mimeType: CreationOptional<string>

  @Attribute(DataTypes.INTEGER)
  declare size: CreationOptional<number>

  @Attribute(DataTypes.BLOB)
  declare content: CreationOptional<Buffer>

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
  @BelongsTo(() => User, {
    foreignKey: "createdByUserId",
    inverse: {
      as: "vendorDocumentation",
      type: "hasMany",
    },
  })
  declare createdByUser?: NonAttribute<User>

  @BelongsTo(() => User, {
    foreignKey: {
      name: "reviewByUserId",
      allowNull: true,
    },
    inverse: {
      as: "vendorDocumentations",
      type: "hasMany",
    },
  })
  declare reviewByUser?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {}
}

export default VendorDocumentation
