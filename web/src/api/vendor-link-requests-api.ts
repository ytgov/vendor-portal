import http from "@/api/http-client"

/** Keep in sync with api/src/models/vendor-link-request.ts */
export type VendorLinkRequest = {
  id: number
  userId: number
  matchedVendorId: string | null
  businessName: string | null
  operatingName: string | null
  ycorNumber: string | null
  address: string | null
  vendorId: string | null
  status: string
  decisionByUserId: number | null
  decisionAt: Date | null
  reviewNotes: string | null
  createdAt: string
  updatedAt: string
}

export type VendorLinkRequestWhereOptions = {
  userId?: number
  matchedVendorId?: string
  businessName?: string
  operatingName?: string
  ycorNumber?: string
  address?: string
  vendorId?: string
  status?: string
  decisionByUserId?: number
  decisionAt?: Date
}

/** Keep in sync with scopes in api/src/models/vender-link-request.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type VendorLinkRequestFiltersOptions = {}

export type VendorLinkRequestQueryOptions = {
  where?: VendorLinkRequestWhereOptions
  filters?: VendorLinkRequestFiltersOptions
  page?: number
  perPage?: number
}

export const venderLinkRequestsApi = {
  async list(params: VendorLinkRequestQueryOptions = {}): Promise<{
    venderLinkRequests: VendorLinkRequest[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vender-link-requests", { params })
    return data
  },

  async get(venderLinkRequestId: number): Promise<{ venderLinkRequest: VendorLinkRequest }> {
    const { data } = await http.get(`/api/vender-link-requests/${venderLinkRequestId}`)
    return data
  },

  async create(
    attributes: Partial<VendorLinkRequest>
  ): Promise<{ venderLinkRequest: VendorLinkRequest }> {
    const { data } = await http.post("/api/vender-link-requests", attributes)
    return data
  },

  async update(
    venderLinkRequestId: number,
    attributes: Partial<VendorLinkRequest>
  ): Promise<{ venderLinkRequest: VendorLinkRequest }> {
    const { data } = await http.patch(
      `/api/vender-link-requests/${venderLinkRequestId}`,
      attributes
    )
    return data
  },

  async delete(venderLinkRequestId: number): Promise<void> {
    const { data } = await http.delete(`/api/vender-link-requests/${venderLinkRequestId}`)
    return data
  },
}

export default venderLinkRequestsApi
