import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import ProgramDocumentation from "@/models/program-documentation"

export async function seed(): Promise<void> {
  const programDocumentationsAttributes: CreationAttributes<ProgramDocumentation>[] = [
    {
      programId: 1,
      documentationId: 1,
      purpose: "pslr1",
    },
    {
      programId: 1,
      documentationId: 2,
      purpose: "pslr2",
    },
    {
      programId: 1,
      documentationId: 3,
      purpose: "pslr3",
    },
    {
      programId: 1,
      documentationId: 4,
      purpose: "pslr4",
    },
    {
      programId: 1,
      documentationId: 5,
      purpose: "pslr5",
    },
    {
      programId: 1,
      documentationId: 6,
      purpose: "pslr6",
    },
  ]

  for (const programDocumentationAttributes of programDocumentationsAttributes) {
    const programDocumentation = await ProgramDocumentation.findOne({
      where: {
        purpose: programDocumentationAttributes.purpose,
      },
    })
    if (isNil(programDocumentation)) {
      await ProgramDocumentation.create(programDocumentationAttributes)
    } else {
      await programDocumentation.update(programDocumentationAttributes)
    }
  }
}
