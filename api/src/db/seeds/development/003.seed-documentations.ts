import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Documentation from "@/models/documentation"

export async function seed(): Promise<void> {
  const documentationsAttributes: CreationAttributes<Documentation>[] = [
    {
      name: "YCOR Certificate",
      format: Documentation.Formats.FILE,
    },
    {
      name: "Business License",
      format: Documentation.Formats.FILE,
    },
    {
      name: "CRA Remittance",
      format: Documentation.Formats.FILE,
    },
    {
      name: "Paid Sick Leave Policy",
      format: Documentation.Formats.FILE,
    },
    {
      name: "Mailing Address",
      format: Documentation.Formats.TEXT,
    },
    {
      name: "Physical Address",
      format: Documentation.Formats.TEXT,
    },
  ]

  for (const documentationAttributes of documentationsAttributes) {
    const documentation = await Documentation.findOne({
      where: {
        name: documentationAttributes.name,
      },
    })
    if (isNil(documentation)) {
      await Documentation.create(documentationAttributes)
    } else {
      await documentation.update(documentationAttributes)
    }
  }
}
