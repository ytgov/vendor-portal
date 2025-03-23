import http from "@/api/http-client"

/** Keep in sync with api/src/models/program.ts */
export type Program = {
  id: number
  slug: string
  startDate: Date | null
  endDate: Date | null
  department: string
  offeredBy: string
  isActive: boolean
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type ProgramWhereOptions = {
  slug?: string
  startDate?: Date
  endDate?: Date
  department?: string
  offeredBy?: string
  isActive?: boolean
  name?: string
}

/** Keep in sync with scopes in api/src/models/program.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ProgramFiltersOptions = {}

export type ProgramQueryOptions = {
  where?: ProgramWhereOptions
  filters?: ProgramFiltersOptions
  page?: number
  perPage?: number
}

export const programsApi = {
  async list(params: ProgramQueryOptions = {}): Promise<{
    programs: Program[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/programs", { params })
    return data
  },

  async get(programId: number): Promise<{ program: Program }> {
    const { data } = await http.get(`/api/programs/${programId}`)
    return data
  },

  async create(attributes: Partial<Program>): Promise<{ program: Program }> {
    const { data } = await http.post("/api/programs", attributes)
    return data
  },

  async update(programId: number, attributes: Partial<Program>): Promise<{ program: Program }> {
    const { data } = await http.patch(`/api/programs/${programId}`, attributes)
    return data
  },

  async delete(programId: number): Promise<void> {
    const { data } = await http.delete(`/api/programs/${programId}`)
    return data
  },
}

export default programsApi
