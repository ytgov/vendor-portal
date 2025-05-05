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
  Default,
  Index,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { isNil } from "lodash"

import BaseModel from "@/models/base-model"

/** Keep in sync with web/src/api/users-api.ts */
export enum UserRoles {
  SYSTEM_ADMIN = "system_admin",
  PROGRAM_ADMIN = "program_admin",
  USER = "user",
}

export class User extends BaseModel<InferAttributes<User>, InferCreationAttributes<User>> {
  static readonly Roles = UserRoles

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare email: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index({ unique: true })
  declare auth0Subject: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare firstName: string

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare lastName: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  declare displayName: string

  @Attribute({
    type: DataTypes.STRING(255),
    get() {
      const roles = this.getDataValue("roles")
      if (isNil(roles)) {
        return []
      }
      return roles.split(",")
    },
    set(value: string[]) {
      this.setDataValue("roles", value.join(","))
    },
  })
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(UserRoles)],
      msg: `Role must be one of ${Object.values(UserRoles).join(", ")}`,
    },
  })
  declare roles: string[]

  @Attribute(DataTypes.DATE(0))
  declare deactivatedAt: Date | null

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
  get isSystemAdmin(): NonAttribute<boolean | undefined> {
    return this.roles?.some((role) => role === UserRoles.SYSTEM_ADMIN)
  }

  // Associations
  // Add as needed

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["firstName", "lastName", "displayName", "email"])
  }
}

export default User
