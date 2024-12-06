import http from "@/api/http-client"
import { type Policy } from "@/api/base-api"
import { VendorProgram } from "@/api/vendor-programs-api"

/** Keep in sync with api/src/models/vendor.ts */
export type Vendor = {
  id: number
  vendorId: string
  name: string
  address: string

  createdAt: string
  updatedAt: string

  // Virtuals

  // Associations
  programs: VendorProgram[]
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
    vendors: Vendor[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendors", {
      params,
    })
    return data
  },
  async get(vendorId: number | string): Promise<{
    vendor: Vendor
    policy: Policy
  }> {
    const { data } = await http.get(`/api/vendors/${vendorId}`)
    return data
  },
  async create(attributes: Partial<Vendor>): Promise<{
    vendor: Vendor
  }> {
    const { data } = await http.post("/api/vendors", attributes)
    return data
  },
  async update(
    vendorId: number | string,
    attributes: Partial<Vendor>
  ): Promise<{
    vendor: Vendor
  }> {
    const { data } = await http.patch(`/api/vendors/${vendorId}`, attributes)
    return data
  },
}

export default vendorsApi
