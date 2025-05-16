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
      description: `<p class="mb-3">
    The Paid Sick Leave Rebate provides up to 40 hours of wages for eligible workers who are sick
    with illness (or injury not covered by any other act, benefit or program).
  </p>
  <p class="mb-3">
    This program helps Yukoners prioritize their health and reduce the spread of illness in the
    workplace.
  </p>
  <p class="mb-3">
    For more information, visit
    <a
      href="https://yukon.ca/en/health-and-wellness/covid-19-information/economic-and-social-supports-covid-19/paid-sick-leave"
      target="_blank"
      >Yukon.ca</a
    >.
  </p>`,
    },
    {
      slug: "test-program",
      department: "Testing Development",
      offeredBy: "None",
      isActive: true,
      name: "Testing program",
      description: "<p>Test program description</p>",
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
