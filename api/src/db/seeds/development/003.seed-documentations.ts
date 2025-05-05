import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Documentation from "@/models/documentation"

export async function seed(): Promise<void> {
  const documentationsAttributes: CreationAttributes<Documentation>[] = [
    {
      name: "YCOR Certificate",
      format: "File Upload",
    },
    {
      name: "Business License",
      format: "File Upload",
    },
    {
      name: "CRA Remittance",
      format: "File Upload",
    },
    {
      name: "Paid Sick Leave Policy",
      format: "File Upload",
    },
    {
      name: "Mailing Address",
      format: "Text Input",
    },
    {
      name: "Physical Address",
      format: "Text Input",
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
