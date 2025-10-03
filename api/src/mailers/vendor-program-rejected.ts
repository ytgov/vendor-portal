import { readFileSync } from "fs"
import { isNil } from "lodash"
import { join } from "path"

import { BASE_TEMPLATE_PATH, EmailService } from "@/mailers/email-service"
import { User, Vendor, VendorProgram } from "@/models"
import { formatDate } from "@/utils/formatters"

export class VendorProgramRejectedMailer {
  static async sendEmail(vendorProgram: VendorProgram, vendor: Vendor, user: User) {
    if (isNil(vendorProgram.program)) {
      throw new Error("VendorProgram must have a program loaded")
    }

    const emailService = new EmailService()
    const TEMPLATE_PATH = join(BASE_TEMPLATE_PATH, "vendor-program-rejected.html")

    let content = readFileSync(TEMPLATE_PATH).toString()

    content = content.replace(/``REQUEST_DATE``/g, formatDate(vendorProgram.createdAt))
    content = content.replace(/``VENDOR_NAME``/g, vendor.name)
    content = content.replace(/``PROGRAM_NAME``/g, vendorProgram.program.name)

    return emailService.sendEmail(
      user.displayName,
      user.email,
      "Vendor Program Application Rejected",
      content
    )
  }
}
