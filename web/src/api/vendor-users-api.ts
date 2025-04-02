import http from "@/api/http-client"

/** Keep in sync with api/src/models/vendor-user.ts */
export type VendorUser = {
  id: number
  vendorId: number
  userId: number
  isActive: boolean
  isAdmin: boolean
  decisionByUserId: number | null
  decisionAt: Date | null
  createdAt: string
  updatedAt: string
}

export type VendorUserWhereOptions = {
  vendorId?: number
  userId?: number
  isActive?: boolean
  isAdmin?: boolean
  decisionByUserId?: number
  decisionAt?: Date
}

/** Keep in sync with scopes in api/src/models/vendor-user.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type VendorUserFiltersOptions = {}

export type VendorUserQueryOptions = {
  where?: VendorUserWhereOptions
  filters?: VendorUserFiltersOptions
  page?: number
  perPage?: number
}

export const vendorUsersApi = {
  async list(params: VendorUserQueryOptions = {}): Promise<{
    vendorUsers: VendorUser[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendor-users", { params })
    return data
  },

  async get(vendorUserId: number): Promise<{ vendorUser: VendorUser }> {
    const { data } = await http.get(`/api/vendor-users/${vendorUserId}`)
    return data
  },

  async create(attributes: Partial<VendorUser>): Promise<{ vendorUser: VendorUser }> {
    const { data } = await http.post("/api/vendor-users", attributes)
    return data
  },

  async update(
    vendorUserId: number,
    attributes: Partial<VendorUser>
  ): Promise<{ vendorUser: VendorUser }> {
    const { data } = await http.patch(`/api/vendor-users/${vendorUserId}`, attributes)
    return data
  },

  async delete(vendorUserId: number): Promise<void> {
    const { data } = await http.delete(`/api/vendor-users/${vendorUserId}`)
    return data
  },
}

export default vendorUsersApi
