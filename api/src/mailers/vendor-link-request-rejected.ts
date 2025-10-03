import { readFileSync } from "fs"
import { isNil } from "lodash"
import { join } from "path"

import { BASE_TEMPLATE_PATH, EmailService } from "@/mailers/email-service"
import { VendorLinkRequest } from "@/models"
import { formatDate } from "@/utils/formatters"

export class VendorLinkRequestRejectedMailer {
  static async sendEmail(vendorLinkRequest: VendorLinkRequest) {
    if (isNil(vendorLinkRequest.user)) {
      throw new Error("VendorLinkRequest must have a user loaded")
    }

    const emailService = new EmailService()
    const TEMPLATE_PATH = join(BASE_TEMPLATE_PATH, "vendor-link-request-rejected.html")

    let content = readFileSync(TEMPLATE_PATH).toString()

    content = content.replace(/``REQUEST_DATE``/g, formatDate(vendorLinkRequest.createdAt))
    content = content.replace(/``VENDOR_NAME``/g, vendorLinkRequest.businessName)

    return emailService.sendEmail(
      vendorLinkRequest.user.displayName,
      vendorLinkRequest.user.email,
      "Vendor Link Request Rejected",
      content
    )
  }
}
