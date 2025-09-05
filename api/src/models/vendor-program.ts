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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import User from "@/models/user"
import Program from "@/models/program"
import arrayWrap from "@/utils/array-wrap"
import whereFieldsOptionallyLikeTerms from "@/utils/search/where-fields-optionally-like-terms"

/** Keep in sync with web/src/api/vendor-programs-api.ts */
export enum VendorProgramStatuses {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export class VendorProgram extends BaseModel<
  InferAttributes<VendorProgram>,
  InferCreationAttributes<VendorProgram>
> {
  static readonly Statuses = VendorProgramStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare vendorId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare programId: number

  @Attribute(DataTypes.DATE(0))
  declare startDate: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare endDate: CreationOptional<Date>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare requestedByUserId: number

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare requestedAt: CreationOptional<Date>

  @Attribute(DataTypes.STRING(100))
  @ValidateAttribute({
    isIn: {
      args: [Object.values(VendorProgramStatuses)],
      msg: `Status must be one of ${Object.values(VendorProgramStatuses).join(", ")}`,
    },
  })
  @Default(VendorProgramStatuses.PENDING)
  declare status: CreationOptional<string>

  @Attribute(DataTypes.INTEGER)
  declare reviewByUserId: CreationOptional<number>

  @Attribute(DataTypes.DATE(0))
  declare reviewAt: CreationOptional<Date>

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

  @BelongsTo(() => Program, {
    foreignKey: {
      name: "programId",
      allowNull: false,
    },
  })
  declare program?: NonAttribute<Program>

  @BelongsTo(() => User, {
    foreignKey: "requestedByUserId",
  })
  declare requestedByUser?: NonAttribute<User>

  @BelongsTo(() => User, {
    foreignKey: {
      name: "reviewByUserId",
      allowNull: true,
    },
  })
  declare reviewByUser?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {
    this.addScope(
      "search",
      (termOrTerms: string | string[]): FindOptions<Attributes<VendorProgram>> => {
        const terms = arrayWrap(termOrTerms)
        if (terms.length === 0) {
          return {}
        }

        const searchableFields = [
          "requestedByUser.display_name",
          "requestedByUser.email",
          "requestedByUser.first_name",
          "requestedByUser.last_name",
        ]
        const associatedSearchableFieldsOptionallyLikeTerms = whereFieldsOptionallyLikeTerms(
          searchableFields,
          terms
        )

        return {
          where: associatedSearchableFieldsOptionallyLikeTerms,
          include: [
            {
              association: "requestedByUser",
              required: false,
            },
          ],
        }
      }
    )
  }
}

export default VendorProgram
