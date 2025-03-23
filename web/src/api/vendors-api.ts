import http from "@/api/http-client"

import { VendorProgram } from "@/api/vendor-programs-api"

/** Keep in sync with api/src/models/vendor.ts */
export type Vendor = {
  id: number
  slug: string
  status: string
  org: string
  vendorId: string
  name: string
  shortName: string
  isActive: boolean
  isPerson: boolean
  isPayable: boolean
  isElectronicPay: boolean
  addressLine1: string
  addressLine2: string
  addressProvince: string
  addressPostal: string
  createdAt: string
  updatedAt: string

  // Virtuals

  // Associations
  programs: VendorProgram[]
}

export type VendorWhereOptions = {
  slug?: string
  status?: string
  org?: string
  vendorId?: string
  name?: string
  shortName?: string
  isActive?: boolean
  isPerson?: boolean
  isPayable?: boolean
  isElectronicPay?: boolean
  addressLine1?: string
  addressLine2?: string
  addressProvince?: string
  addressPostal?: string
}

/** Keep in sync with scopes in api/src/models/vendor.ts */
export type VendorFiltersOptions = {
  search?: string | string[]
  // TODO: implement isActive scope in back-end
}

export type VendorQueryOptions = {
  where?: VendorWhereOptions
  filters?: VendorFiltersOptions
  page?: number
  perPage?: number
}

export const vendorsApi = {
  async list(params: VendorQueryOptions = {}): Promise<{
    vendors: Vendor[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendors", { params })
    return data
  },

  async get(vendorId: number): Promise<{ vendor: Vendor }> {
    const { data } = await http.get(`/api/vendors/${vendorId}`)
    return data
  },

  async create(attributes: Partial<Vendor>): Promise<{ vendor: Vendor }> {
    const { data } = await http.post("/api/vendors", attributes)
    return data
  },

  async update(vendorId: number, attributes: Partial<Vendor>): Promise<{ vendor: Vendor }> {
    const { data } = await http.patch(`/api/vendors/${vendorId}`, attributes)
    return data
  },

  async delete(vendorId: number): Promise<void> {
    const { data } = await http.delete(`/api/vendors/${vendorId}`)
    return data
  },
}

export default vendorsApi
