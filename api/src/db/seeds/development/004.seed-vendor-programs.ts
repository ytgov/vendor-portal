import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import VendorProgram from "@/models/vendor-program"

export async function seed(): Promise<void> {
  const vendorProgramsAttributes: CreationAttributes<VendorProgram>[] = [
    {
      vendorId: 1,
      programId: 1,
      requestedByUserId: 1,
      status: "ACTIVE",
    },
    {
      vendorId: 1,
      programId: 2,
      requestedByUserId: 1,
      status: "ACTIVE",
    },
    {
      vendorId: 1,
      programId: 3,
      requestedByUserId: 1,
      status: "ACTIVE",
    },
  ]

  for (const vendorProgramAttributes of vendorProgramsAttributes) {
    const vendorProgram = await VendorProgram.findOne({
      where: {
        vendorId: vendorProgramAttributes.vendorId,
        programId: vendorProgramAttributes.programId,
      },
    })
    if (isNil(vendorProgram)) {
      await VendorProgram.create(vendorProgramAttributes)
    } else {
      await vendorProgram.update(vendorProgramAttributes)
    }
  }
}
