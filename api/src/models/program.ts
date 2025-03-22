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
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import ProgramUser from "@/models/program-user"
import User from "@/models/user"
import Documentation from "@/models/documentation"
import ProgramDocumentation from "@/models/program-documentation"

export class Program extends BaseModel<InferAttributes<Program>, InferCreationAttributes<Program>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare slug: string

  @Attribute(DataTypes.DATE(0))
  declare startDate: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare endDate: CreationOptional<Date>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare department: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare offeredBy: string

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isActive: boolean

  @Attribute(DataTypes.STRING(150))
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(2000))
  declare description: CreationOptional<string>

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
    through: () => ProgramUser,
    foreignKey: "programId",
    otherKey: "userId",
    throughAssociations: {
      fromSource: "programUsers",
      toSource: "program",
      fromTarget: "programUsers",
      toTarget: "user",
    },
  })
  declare users?: NonAttribute<User[]>

  @BelongsToMany(() => Documentation, {
    through: () => ProgramDocumentation,
    foreignKey: "programId",
    otherKey: "documentationId",
    throughAssociations: {
      fromSource: "programDocumentations",
      toSource: "program",
      fromTarget: "programDocumentations",
      toTarget: "documentation",
    },
  })
  declare documentations?: NonAttribute<Documentation[]>

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["department", "name"])
  }
}

export default Program
