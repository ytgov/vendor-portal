import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { VendorLinkRequest } from "@/models"
import BaseService from "@/services/base-service"
import { readFileSync } from "fs"

export type VendorLinkRequestCreationAttributes = Partial<CreationAttributes<VendorLinkRequest>>

export class CreateService extends BaseService {
  constructor(
    private attributes: VendorLinkRequestCreationAttributes,
    private ycorRegistrationDocumentPath: string,
    private mostRecentUtilityBillPath: string
  ) {
    super()
  }

  async perform(): Promise<VendorLinkRequest> {
    if (isNil(this.ycorRegistrationDocumentPath)) {
      throw new Error("ycorRegistrationDocumentPath is required")
    }

    if (isNil(this.mostRecentUtilityBillPath)) {
      throw new Error("mostRecentUtilityBillPath is required")
    }

    const ycorRegistrationDocumentFileContents = readFileSync(this.ycorRegistrationDocumentPath)
    const mostRecentUtilityBillFileContents = readFileSync(this.mostRecentUtilityBillPath)

    const {
      userId,
      ycorRegistrationDocumentFileName,
      ycorRegistrationDocumentMimeType,
      ycorRegistrationDocumentSize,
      ycorRegistrationDocumentContent,
      mostRecentUtilityBillFileName,
      mostRecentUtilityBillMimeType,
      mostRecentUtilityBillSize,
      mostRecentUtilityBillContent,
      ...optionalAttributes
    } = this.attributes

    if (isNil(userId)) {
      throw new Error("userId is required")
    }

    if (isNil(ycorRegistrationDocumentFileName)) {
      throw new Error("ycorRegistrationDocumentFileName is required")
    }

    if (isNil(ycorRegistrationDocumentMimeType)) {
      throw new Error("ycorRegistrationDocumentMimeType is required")
    }

    if (isNil(ycorRegistrationDocumentSize)) {
      throw new Error("ycorRegistrationDocumentSize is required")
    }

    if (isNil(mostRecentUtilityBillFileName)) {
      throw new Error("mostRecentUtilityBillFileName is required")
    }

    if (isNil(mostRecentUtilityBillMimeType)) {
      throw new Error("mostRecentUtilityBillMimeType is required")
    }

    if (isNil(mostRecentUtilityBillSize)) {
      throw new Error("mostRecentUtilityBillSize is required")
    }

    const vendorLinkRequest = await VendorLinkRequest.create({
      ...optionalAttributes,
      userId,
      ycorRegistrationDocumentFileName,
      ycorRegistrationDocumentMimeType,
      ycorRegistrationDocumentSize,
      ycorRegistrationDocumentContent: ycorRegistrationDocumentFileContents,
      mostRecentUtilityBillFileName,
      mostRecentUtilityBillMimeType,
      mostRecentUtilityBillSize,
      mostRecentUtilityBillContent: mostRecentUtilityBillFileContents,
    })

    return vendorLinkRequest
  }
}

export default CreateService
