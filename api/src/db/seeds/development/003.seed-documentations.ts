import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Documentation from "@/models/documentation"

export async function seed(): Promise<void> {
  const documentationsAttributes: CreationAttributes<Documentation>[] = [
    {
      name: "YCOR Certificate",
      format: "file",
    },
    {
      name: "Business License",
      format: "file",
    },
    {
      name: "CRA Remittance",
      format: "file",
    },
    {
      name: "Paid Sick Leave Policy",
      format: "file",
    },
    {
      name: "Mailing Address",
      format: "text",
    },
    {
      name: "Physical Address",
      format: "text",
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
