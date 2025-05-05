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

/** Keep in sync with web/src/api/vendor-link-requests-api.ts */
export enum VendorLinkRequestStatuses {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export class VendorLinkRequest extends BaseModel<
  InferAttributes<VendorLinkRequest>,
  InferCreationAttributes<VendorLinkRequest>
> {
  static readonly Statuses = VendorLinkRequestStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number

  @Attribute(DataTypes.STRING(50))
  declare matchedVendorId: CreationOptional<string>

  @Attribute(DataTypes.STRING(150))
  declare businessName: CreationOptional<string>

  @Attribute(DataTypes.STRING(150))
  declare operatingName: CreationOptional<string>

  @Attribute(DataTypes.STRING(50))
  declare ycorNumber: CreationOptional<string>

  @Attribute(DataTypes.STRING(500))
  declare address: CreationOptional<string>

  @Attribute(DataTypes.STRING(50))
  declare vendorId: CreationOptional<string>

  @Attribute(DataTypes.STRING(100))
  @ValidateAttribute({
    isIn: {
      args: [Object.values(VendorLinkRequestStatuses)],
      msg: `Status must be one of ${Object.values(VendorLinkRequestStatuses).join(", ")}`,
    },
  })
  @Default(VendorLinkRequestStatuses.PENDING)
  declare status: CreationOptional<string>

  @Attribute(DataTypes.INTEGER)
  declare decisionByUserId: CreationOptional<number>

  @Attribute(DataTypes.DATE(0))
  declare decisionAt: CreationOptional<Date>

  @Attribute(DataTypes.STRING(2000))
  declare reviewNotes: CreationOptional<string>

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
    foreignKey: "userId",
    inverse: {
      as: "vendorLinkRequests",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>

  @BelongsTo(() => User, {
    foreignKey: {
      name: "decisionByUserId",
      allowNull: true,
    },
  })
  declare decisionByUser?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {}
}

export default VendorLinkRequest
