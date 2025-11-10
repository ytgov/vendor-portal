import { readFileSync } from "fs"
import { isNil } from "lodash"
import { join } from "path"

import { BASE_TEMPLATE_PATH, EmailService } from "@/mailers/email-service"
import { Vendor, VendorLinkRequest } from "@/models"
import { formatDate } from "@/utils/formatters"

export class VendorLinkRequestAcceptedMailer {
  static async sendEmail(vendorLinkRequest: VendorLinkRequest, vendor: Vendor) {
    if (isNil(vendorLinkRequest.user)) {
      throw new Error("VendorLinkRequest must have a user loaded")
    }

    const emailService = new EmailService()
    const TEMPLATE_PATH = join(BASE_TEMPLATE_PATH, "vendor-link-request-accepted.html")

    let content = readFileSync(TEMPLATE_PATH).toString()

    content = content.replace(/``REQUEST_DATE``/g, formatDate(vendorLinkRequest.createdAt))
    content = content.replace(/``VENDOR_NAME``/g, vendor.name)

    return emailService.sendEmail(
      vendorLinkRequest.user.displayName,
      vendorLinkRequest.user.email,
      "Vendor Link Request Accepted",
      content
    )
  }
}
