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
  BelongsToMany,
  Default,
  Index,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import User from "@/models/user"
import VendorUser from "@/models/vendor-user"
import Program from "@/models/program"
import Documentation from "@/models/documentation"
import VendorDocumentation from "@/models/vendor-documentation"
import VendorProgram from "@/models/vendor-program"

export enum VendorStatuses {
  ACTIVE = "Active",
  INACTIVE = "InActive",
}

export class Vendor extends BaseModel<InferAttributes<Vendor>, InferCreationAttributes<Vendor>> {
  static readonly Statuses = VendorStatuses

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare slug: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(VendorStatuses)],
      msg: `Status must be one of ${Object.values(VendorStatuses).join(", ")}`,
    },
  })
  declare status: string

  @Attribute(DataTypes.STRING(10))
  @NotNull
  declare org: string

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare vendorId: string

  @Attribute(DataTypes.STRING(150))
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(50))
  @NotNull
  declare shortName: string

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isActive: boolean

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(false)
  declare isPerson: boolean

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isPayable: boolean

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isElectronicPay: boolean

  @Attribute(DataTypes.STRING(100))
  declare addressCity: CreationOptional<string>

  @Attribute(DataTypes.STRING(100))
  declare addressLine1: CreationOptional<string>

  @Attribute(DataTypes.STRING(100))
  declare addressLine2: CreationOptional<string>

  @Attribute(DataTypes.STRING(100))
  declare addressProvince: CreationOptional<string>

  @Attribute(DataTypes.STRING(20))
  declare addressPostal: CreationOptional<string>

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
  @BelongsToMany(() => User, {
    through: () => VendorUser,
    foreignKey: "vendorId",
    otherKey: "userId",
    inverse: "vendors",
    throughAssociations: {
      fromSource: "vendorUsers",
      toSource: "vendor",
      fromTarget: "vendorUsers",
      toTarget: "user",
    },
  })
  declare users?: NonAttribute<User[]>

  @BelongsToMany(() => Program, {
    through: () => VendorProgram,
    foreignKey: "vendorId",
    otherKey: "programId",
    inverse: "vendors",
    throughAssociations: {
      fromSource: "vendorPrograms",
      toSource: "vendor",
      fromTarget: "vendorPrograms",
      toTarget: "program",
    },
  })
  declare programs?: NonAttribute<Program[]>

  @BelongsToMany(() => Documentation, {
    through: () => VendorDocumentation,
    foreignKey: "vendorId",
    otherKey: "documentationId",
    throughAssociations: {
      fromSource: "vendorDocumentations",
      toSource: "vendor",
      fromTarget: "vendorDocumentations",
      toTarget: "documentation",
    },
  })
  declare documentations?: NonAttribute<Documentation[]>

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["org", "vendorId", "name"])

    this.addScope("withPendingProgram", (programId: number) => {
      return {
        include: [
          {
            association: "vendorPrograms",
            where: {
              programId,
              status: VendorProgram.Statuses.PENDING,
            },
          },
        ],
      }
    })
  }
}

export default Vendor
