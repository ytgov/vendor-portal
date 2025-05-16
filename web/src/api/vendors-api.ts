import http from "@/api/http-client"

import { Program } from "@/api/programs-api"

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
  addressCity: string
  addressLine1: string
  addressLine2: string
  addressProvince: string
  addressPostal: string
  createdAt: string
  updatedAt: string

  // Virtuals

  // Associations
  programs: Program[] | null
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
  addressCity?: string
  addressLine1?: string
  addressLine2?: string
  addressProvince?: string
  addressPostal?: string
}

/** Keep in sync with scopes in api/src/models/vendor.ts */
export type VendorFiltersOptions = {
  search?: string | string[]
  withPendingProgram?: number
  withoutPendingProgram?: number
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

  async get(vendorId: number | string): Promise<{ vendor: Vendor }> {
    const { data } = await http.get(`/api/vendors/${vendorId}`)
    return data
  },
}

export default vendorsApi
