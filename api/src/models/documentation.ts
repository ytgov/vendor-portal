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
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"

/** Keep in sync with web/src/api/documentations-api.ts */
export enum DocumentationFormats {
  FILE = "File",
  TEXT = "Text",
}

export class Documentation extends BaseModel<
  InferAttributes<Documentation>,
  InferCreationAttributes<Documentation>
> {
  static readonly Formats = DocumentationFormats

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
  @ValidateAttribute({
    isIn: {
      args: [Object.values(DocumentationFormats)],
      msg: `Format must be one of ${Object.values(DocumentationFormats).join(", ")}`,
    },
  })
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
  static establishScopes(): void {
    this.addSearchScope(["name"])

    this.addScope("inProgram", (programId: number) => {
      return {
        include: [
          {
            association: "programDocumentations",
            where: {
              programId,
            },
          },
        ],
      }
    })
  }
}

export default Documentation
