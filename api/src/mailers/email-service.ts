import fs from "fs"
import path from "path"
import nodemailer, { Transporter, TransportOptions } from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

import { MAIL_CONFIG, MAIL_FROM, APPLICATION_NAME, FRONTEND_URL } from "@/config"

export const BASE_TEMPLATE_PATH = path.join(__dirname, "../templates")

export class EmailService {
  transport: Transporter

  constructor() {
    this.transport = nodemailer.createTransport(MAIL_CONFIG as TransportOptions)
  }

  async verify() {
    return this.transport
      .verify()
      .then((response) => {
        return { connection: response }
      })
      .catch((error) => {
        console.log("Mailer verify error:", error)
        return { connection: false, error }
      })
  }

  async sendEmail(toName: string, toEmail: string, subject: string, customContent: string) {
    const basePath = path.join(BASE_TEMPLATE_PATH, "base.html")
    let baseContent = fs.readFileSync(basePath).toString()

    baseContent = baseContent.replace(/``CUSTOM_CONTENT``/, customContent)
    baseContent = baseContent.replace(/``APPLICATION_URL``/g, FRONTEND_URL)
    baseContent = baseContent.replace(/``APPLICATION_NAME``/g, APPLICATION_NAME)
    baseContent = baseContent.replace(/``TO_NAME``/g, toName)
    baseContent = baseContent.replace(/``TO_EMAIL``/g, toEmail)

    const message: MailOptions = {
      from: MAIL_FROM,
      to: `"${toName}" <${toEmail}>`,
      subject: `${subject}`,
      html: baseContent,
    }

    if (!toEmail || toEmail.length == 0) {
      console.log("Not sending email to " + toName + " without an email address")
      return null
    }

    return this.transport
      .sendMail(message)
      .then((resp) => resp)
      .catch((err) => {
        console.log("EMAILING ERROR", err)
      })
  }
}
