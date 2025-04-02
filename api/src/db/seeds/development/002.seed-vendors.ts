import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import Vendor from "@/models/vendor"

export async function seed(): Promise<void> {
  const vendorsAttributes: CreationAttributes<Vendor>[] = [
    {
      slug: "ice-fog-analytics",
      status: "active",
      org: "ICEFOG",
      vendorId: "CDICEFOGANAL",
      name: "Ice Fog Analytics Inc.",
      shortName: "Ice Fog",
      isActive: true,
      isPerson: false,
      isPayable: false,
      isElectronicPay: false,
      addressLine1: "2 Stope Way",
      addressLine2: "",
      addressProvince: "Whitehorse, YT",
      addressPostal: "Y1A0B3",
    },
    {
      slug: "john-doe-consulting",
      status: "pending",
      org: "JOHNDOE",
      vendorId: "CDJOHNDOE",
      name: "John Doe",
      shortName: "J. Doe",
      isActive: true,
      isPerson: true,
      isPayable: true,
      isElectronicPay: true,
      addressLine1: "456 Maple Street",
      addressLine2: "",
      addressProvince: "Vancouver, BC",
      addressPostal: "V6B3K9",
    },
    {
      slug: "bart-simpson-consulting",
      status: "pending",
      org: "BARTSIMP",
      vendorId: "CDBARTSIMPSON",
      name: "Bart Simpson",
      shortName: "B. Simpson",
      isActive: true,
      isPerson: true,
      isPayable: true,
      isElectronicPay: true,
      addressLine1: "456 Maple Street",
      addressLine2: "",
      addressProvince: "Yellowknife, NT",
      addressPostal: "X1A2B4",
    },
  ]

  for (const vendorAttributes of vendorsAttributes) {
    const vendor = await Vendor.findOne({
      where: {
        slug: vendorAttributes.slug,
      },
    })
    if (isNil(vendor)) {
      await Vendor.create(vendorAttributes)
    } else {
      await vendor.update(vendorAttributes)
    }
  }
}
