import http from "@/api/http-client"

import { User } from "@/api/users-api"
import { isArray, isNil } from "lodash"

/** Keep in sync with api/src/models/vendor-link-request.ts */
export enum VendorLinkRequestStatuses {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

/** Keep in sync with api/src/models/vendor-link-request.ts */
export type VendorLinkRequest = {
  id: number
  userId: number
  matchedVendorId: string | null
  businessName: string | null
  operatingName: string | null
  ycorNumber: string | null
  mailingAddress: string | null
  physicalAddress: string | null
  businessDescription: string | null
  vendorId: string | null

  ycorRegistrationDocumentFileName: string
  ycorRegistrationDocumentMimeType: string
  ycorRegistrationDocumentSize: number
  ycorRegistrationDocumentContent: { type: string; data: number[] }

  mostRecentUtilityBillFileName: string
  mostRecentUtilityBillMimeType: string
  mostRecentUtilityBillSize: number
  mostRecentUtilityBillContent: { type: string; data: number[] }

  status: VendorLinkRequestStatuses
  decisionByUserId: number | null
  decisionAt: string | null
  reviewNotes: string | null
  createdAt: string
  updatedAt: string

  // Associations
  user: User | null
  decisionByUser: User | null

  // Virtual attributes
  ycorRegistrationDocument: File
  mostRecentUtilityBill: File
}

export type VendorLinkRequestWhereOptions = {
  userId?: number
  matchedVendorId?: string
  businessName?: string
  operatingName?: string
  ycorNumber?: string
  mailingAddress?: string
  physicalAddress?: string
  vendorId?: string
  status?: VendorLinkRequestStatuses
  decisionByUserId?: number
  decisionAt?: string
}

/** Keep in sync with scopes in api/src/models/vendor-link-request.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type VendorLinkRequestFiltersOptions = {}

export type VendorLinkRequestQueryOptions = {
  where?: VendorLinkRequestWhereOptions
  filters?: VendorLinkRequestFiltersOptions
  page?: number
  perPage?: number
}

export const vendorLinkRequestsApi = {
  async list(params: VendorLinkRequestQueryOptions = {}): Promise<{
    vendorLinkRequests: VendorLinkRequest[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendor-link-requests", { params })
    return data
  },
  async get(vendorLinkRequestId: number): Promise<{ vendorLinkRequest: VendorLinkRequest }> {
    const { data } = await http.get(`/api/vendor-link-requests/${vendorLinkRequestId}`)
    return data
  },
  async create(
    attributes: Partial<VendorLinkRequest>
  ): Promise<{ vendorLinkRequest: VendorLinkRequest }> {
    const ycorRegistrationDocument = isArray(attributes.ycorRegistrationDocument)
      ? attributes.ycorRegistrationDocument[0]
      : attributes.ycorRegistrationDocument
    if (isNil(ycorRegistrationDocument))
      return Promise.reject("YCOR Registration Document is required")

    const mostRecentUtilityBill = isArray(attributes.mostRecentUtilityBill)
      ? attributes.mostRecentUtilityBill[0]
      : attributes.mostRecentUtilityBill
    if (isNil(mostRecentUtilityBill)) return Promise.reject("Most Recent Utility Bill is required")

    const { data } = await http.post("/api/vendor-link-requests", attributes, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  async update(
    vendorLinkRequestId: number,
    attributes: Partial<VendorLinkRequest>
  ): Promise<{ vendorLinkRequest: VendorLinkRequest }> {
    const { data } = await http.patch(
      `/api/vendor-link-requests/${vendorLinkRequestId}`,
      attributes
    )
    return data
  },
  async delete(vendorLinkRequestId: number): Promise<void> {
    const { data } = await http.delete(`/api/vendor-link-requests/${vendorLinkRequestId}`)
    return data
  },
  async downloadYcorRegistrationDocument(vendorLinkRequestId: number): Promise<Blob> {
    const { data } = await http.get(
      `/api/vendor-link-requests/${vendorLinkRequestId}/download/ycor-registration-document`,
      {
        responseType: "blob",
      }
    )
    return data
  },
  async downloadMostRecentUtilityBill(vendorLinkRequestId: number): Promise<Blob> {
    const { data } = await http.get(
      `/api/vendor-link-requests/${vendorLinkRequestId}/download/most-recent-utility-bill`,
      {
        responseType: "blob",
      }
    )
    return data
  },
}

export default vendorLinkRequestsApi
