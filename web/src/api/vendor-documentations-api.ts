import http from "@/api/http-client"

/** Keep in sync with api/src/models/vendor-documentation.ts */
export type VendorDocumentation = {
  id: number
  vendorId: number
  documentationId: number
  createdByUserId: number
  status: string
  expiresAt: Date | null
  reviewByUserId: number | null
  reviewAt: Date | null
  reviewNotes: string | null
  textValue: string | null
  fileName: string | null
  mimeType: string | null
  size: string | null
  content: Blob | null
  createdAt: string
  updatedAt: string
}

export type VendorDocumentationWhereOptions = {
  vendorId?: number
  documentationId?: number
  createdByUserId?: number
  status?: string
  expiresAt?: Date
  reviewByUserId?: number
  reviewAt?: Date
  fileName?: string
  mimeType?: string
}

/** Keep in sync with scopes in api/src/models/vendor-documentation.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type VendorDocumentationFiltersOptions = {}

export type VendorDocumentationQueryOptions = {
  where?: VendorDocumentationWhereOptions
  filters?: VendorDocumentationFiltersOptions
  page?: number
  perPage?: number
}

export const vendorDocumentationsApi = {
  async list(params: VendorDocumentationQueryOptions = {}): Promise<{
    vendorDocumentations: VendorDocumentation[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendor-documentations", { params })
    return data
  },

  async get(vendorDocumentationId: number): Promise<{ vendorDocumentation: VendorDocumentation }> {
    const { data } = await http.get(`/api/vendor-documentations/${vendorDocumentationId}`)
    return data
  },

  async create(
    attributes: Partial<VendorDocumentation>
  ): Promise<{ vendorDocumentation: VendorDocumentation }> {
    const { data } = await http.post("/api/vendor-documentations", attributes)
    return data
  },

  async update(
    vendorDocumentationId: number,
    attributes: Partial<VendorDocumentation>
  ): Promise<{ vendorDocumentation: VendorDocumentation }> {
    const { data } = await http.patch(
      `/api/vendor-documentations/${vendorDocumentationId}`,
      attributes
    )
    return data
  },

  async delete(vendorDocumentationId: number): Promise<void> {
    const { data } = await http.delete(`/api/vendor-documentations/${vendorDocumentationId}`)
    return data
  },
}

export default vendorDocumentationsApi
