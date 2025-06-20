import {
  Attributes,
  type CreationOptional,
  DataTypes,
  FindOptions,
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
import User from "@/models/user"
import Vendor from "@/models/vendor"
import arrayWrap from "@/utils/array-wrap"
import whereFieldsOptionallyLikeTerms from "@/utils/search/where-fields-optionally-like-terms"

export class VendorUser extends BaseModel<
  InferAttributes<VendorUser>,
  InferCreationAttributes<VendorUser>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare vendorId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare userId: number

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isActive: boolean

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isAdmin: boolean

  @Attribute(DataTypes.INTEGER)
  declare decisionByUserId: CreationOptional<number>

  @Attribute(DataTypes.DATE(0))
  declare decisionAt: CreationOptional<Date>

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
  @BelongsTo(() => Vendor, {
    foreignKey: { allowNull: false, name: "vendorId" },
    inverse: {
      as: "vendorUsers",
      type: "hasMany",
    },
  })
  declare vendor?: NonAttribute<Vendor>

  @BelongsTo(() => User, {
    foreignKey: { allowNull: false, name: "userId" },
    inverse: {
      as: "vendorUsers",
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
  static establishScopes(): void {
    this.addScope(
      "search",
      (termOrTerms: string | string[]): FindOptions<Attributes<VendorUser>> => {
        const terms = arrayWrap(termOrTerms)
        if (terms.length === 0) {
          return {}
        }

        const searchableFields = [
          "user.display_name",
          "user.email",
          "user.first_name",
          "user.last_name",
          "vendor.name",
          "vendor.vendor_id",
        ]
        const associatedSearchableFieldsOptionallyLikeTerms = whereFieldsOptionallyLikeTerms(
          searchableFields,
          terms
        )

        return {
          where: associatedSearchableFieldsOptionallyLikeTerms,
          include: [
            {
              association: "user",
              required: false,
            },
            {
              association: "vendor",
              required: false,
            },
          ],
        }
      }
    )
  }
}

export default VendorUser
