import http from "@/api/http-client"

import { User } from "@/api/users-api"
import { Program } from "@/api/programs-api"

/** Keep in sync with api/src/models/vendor-program.ts */
export enum VendorProgramStatuses {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export type VendorProgram = {
  id: number
  vendorId: number
  programId: number
  startDate: string | null
  endDate: string | null
  requestedByUserId: number
  requestedAt: string | null
  status: VendorProgramStatuses
  reviewByUserId: number | null
  reviewAt: string | null
  reviewNotes: string | null
  createdAt: string
  updatedAt: string

  // Associations
  program: Program | null
  requestedByUser: User | null
  reviewByUser: User | null
}

export type VendorProgramWhereOptions = {
  vendorId?: number
  programId?: number
  startDate?: string
  endDate?: string
  requestedByUserId?: number
  requestedAt?: string
  status?: VendorProgramStatuses
  reviewByUserId?: number
  reviewAt?: string
}

/** Keep in sync with scopes in api/src/models/vendor-program.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type VendorProgramFiltersOptions = {}

export type VendorProgramQueryOptions = {
  where?: VendorProgramWhereOptions
  filters?: VendorProgramFiltersOptions
  page?: number
  perPage?: number
}

export const vendorProgramsApi = {
  async list(params: VendorProgramQueryOptions = {}): Promise<{
    vendorPrograms: VendorProgram[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/vendor-programs", { params })
    return data
  },

  async get(vendorProgramId: number): Promise<{ vendorProgram: VendorProgram }> {
    const { data } = await http.get(`/api/vendor-programs/${vendorProgramId}`)
    return data
  },

  async create(attributes: Partial<VendorProgram>): Promise<{ vendorProgram: VendorProgram }> {
    const { data } = await http.post("/api/vendor-programs", attributes)
    return data
  },

  async update(
    vendorProgramId: number,
    attributes: Partial<VendorProgram>
  ): Promise<{ vendorProgram: VendorProgram }> {
    const { data } = await http.patch(`/api/vendor-programs/${vendorProgramId}`, attributes)
    return data
  },

  async delete(vendorProgramId: number): Promise<void> {
    const { data } = await http.delete(`/api/vendor-programs/${vendorProgramId}`)
    return data
  },
}

export default vendorProgramsApi
