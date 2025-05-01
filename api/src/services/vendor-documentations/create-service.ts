import { readFile } from "fs/promises"

import { isEmpty, isNil, isString } from "lodash"
import { CreationAttributes } from "@sequelize/core"

import { VendorDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type VendorDocumentationCreationAttributes = Partial<CreationAttributes<VendorDocumentation>>

export class CreateService extends BaseService {
  constructor(
    private attributes: VendorDocumentationCreationAttributes,
    private content: any // ignoring this until PR
  ) {
    super()
  }

  async perform(): Promise<VendorDocumentation> {
    const { vendorId, documentationId, createdByUserId, ...optionalAttributes } = this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(documentationId)) {
      throw new Error("documentationId is required")
    }

    if (isNil(createdByUserId)) {
      throw new Error("createdByUserId is required")
    }

    if (isNil(this.content) || isEmpty(this.content) || !isString(this.content.path)) {
      const vendorDocumentation = await VendorDocumentation.create({
        ...optionalAttributes,
        vendorId,
        documentationId,
        createdByUserId,
      })

      return vendorDocumentation
    }

    const contentBuffer = await readFile(this.content.path)

    const vendorDocumentation = await VendorDocumentation.create({
      ...optionalAttributes,
      vendorId,
      documentationId,
      createdByUserId,
      content: contentBuffer,
    })

    return vendorDocumentation
  }
}

export default CreateService
