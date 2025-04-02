import { CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import { VendorDocumentation } from "@/models"
import BaseService from "@/services/base-service"

export type VendorDocumentationCreationAttributes = Partial<CreationAttributes<VendorDocumentation>>

export class CreateService extends BaseService {
  constructor(private attributes: VendorDocumentationCreationAttributes) {
    super()
  }

  async perform(): Promise<VendorDocumentation> {
    const { vendorId, documentationId, createdByUserId, status, ...optionalAttributes } =
      this.attributes

    if (isNil(vendorId)) {
      throw new Error("vendorId is required")
    }

    if (isNil(documentationId)) {
      throw new Error("documentationId is required")
    }

    if (isNil(createdByUserId)) {
      throw new Error("createdByUserId is required")
    }

    if (isNil(status) || isEmpty(status)) {
      throw new Error("status is required")
    }

    const vendorDocumentation = await VendorDocumentation.create({
      ...optionalAttributes,
      vendorId,
      documentationId,
      createdByUserId,
      status,
    })

    return vendorDocumentation
  }
}

export default CreateService
