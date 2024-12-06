import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"

/** Keep in sync with api/src/models/vendor.ts */
export type VendorProgram = {
  id: number
  name: string
  department: string
  description?: string
  slug: string

  createdAt: string
  updatedAt: string

  // Virtuals

  // Associations
}

export type VendorWhereOptions = {
  vendorId?: string
  name?: string
}

export type VendorFiltersOptions = {
  search?: string | string[]
  // TODO: implement isActive scope in back-end
}

export const vendorsApi = {
  async list(
    params: {
      where?: VendorWhereOptions
      filters?: VendorFiltersOptions
      page?: number
      perPage?: number
    } = {}
  ): Promise<{
    vendors: VendorProgram[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendors", {
      params,
    })
    return data
  },
  async get(vendorId: number | string): Promise<{
    vendor: VendorProgram
    policy: Policy
  }> {
    const { data } = await http.get(`/api/vendors/${vendorId}`)
    return data
  },
  async create(attributes: Partial<VendorProgram>): Promise<{
    vendor: VendorProgram
  }> {
    const { data } = await http.post("/api/vendors", attributes)
    return data
  },
  async update(
    vendorId: number | string,
    attributes: Partial<VendorProgram>
  ): Promise<{
    vendor: VendorProgram
  }> {
    const { data } = await http.patch(`/api/vendors/${vendorId}`, attributes)
    return data
  },
}

export default vendorsApi
