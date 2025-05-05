import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Program from "@/models/program"

export async function seed(): Promise<void> {
  const programsAttributes: CreationAttributes<Program>[] = [
    {
      slug: "paid-sick-leave-rebate",
      department: "Economic Development",
      offeredBy: "Yukon",
      isActive: true,
      name: "Paid Sick Leave Rebate",
    },
    {
      slug: "test-program",
      department: "Testing Development",
      offeredBy: "None",
      isActive: true,
      name: "Testing program",
    },
  ]

  for (const programAttributes of programsAttributes) {
    const program = await Program.findOne({
      where: {
        slug: programAttributes.slug,
      },
    })
    if (isNil(program)) {
      await Program.create(programAttributes)
    } else {
      await program.update(programAttributes)
    }
  }
}
