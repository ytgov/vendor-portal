import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Program from "@/models/program"

export async function seed(): Promise<void> {
  const programsAttributes: CreationAttributes<Program>[] = [
    {
      slug: "computer-science-bsc",
      department: "Faculty of Science",
      offeredBy: "Department of Computer Science",
      isActive: true,
      name: "Bachelor of Science in Computer Science",
    },
    {
      slug: "mechanical-engineering-meng",
      department: "Faculty of Engineering",
      offeredBy: "Department of Mechanical Engineering",
      isActive: true,
      name: "Master of Engineering in Mechanical Engineering",
    },
    {
      slug: "business-administration-mba",
      department: "School of Business",
      offeredBy: "Department of Management",
      isActive: true,
      name: "Master of Business Administration",
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
