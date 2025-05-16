import { readFile } from "fs/promises"

import { isEmpty, isNil, isString } from "lodash"
import { CreationAttributes } from "@sequelize/core"

import { User, VendorDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type VendorDocumentationCreationAttributes = Partial<CreationAttributes<VendorDocumentation>>

export class CreateService extends BaseService {
  constructor(
    private attributes: VendorDocumentationCreationAttributes,
    private content: any, // _TODO_ upgrade file upload pattern
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<VendorDocumentation> {
    const { vendorId, documentationId, ...optionalAttributes } = this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(documentationId)) {
      throw new Error("documentationId is required")
    }

    if (isNil(this.content) || isEmpty(this.content) || !isString(this.content.path)) {
      const vendorDocumentation = await VendorDocumentation.create({
        ...optionalAttributes,
        vendorId,
        documentationId,
        createdByUserId: this.currentUser.id,
      })

      return vendorDocumentation
    }

    const contentBuffer = await readFile(this.content.path)

    if (!Buffer.isBuffer(contentBuffer) || contentBuffer.length === 0) {
      throw new Error("content is empty or not a file")
    }

    const vendorDocumentation = await VendorDocumentation.create({
      ...optionalAttributes,
      vendorId,
      documentationId,
      createdByUserId: this.currentUser.id,
      content: contentBuffer,
    })

    return vendorDocumentation
  }
}

export default CreateService
